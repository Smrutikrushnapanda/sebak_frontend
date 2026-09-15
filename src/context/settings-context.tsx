'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ApiClient } from '@/lib/api-client';

export type RepresentativeType = 'MLA' | 'MP';

export interface AssemblyConstituencyConfig {
  id: string;
  name: string;
  ruralEnabled: boolean;
  urbanEnabled: boolean;
  districtName?: string;
}

export interface ConstituencySettings {
  id: number;
  representativeType: RepresentativeType;
  portalName?: string;
  representativeName: string;
  constituencyName: string;
  stateName?: string;
  districtName?: string;
  lokSabhaName?: string;
  lokSabhaId?: string;
  assemblyName?: string;
  assemblyId?: string;
  ruralEnabled?: boolean;
  urbanEnabled?: boolean;
  assemblyConstituencies?: AssemblyConstituencyConfig[];
  representativeMobileDisplay?: string;
  officeAddress?: string;
  updatedAt?: string;
}

interface SettingsContextType {
  settings: ConstituencySettings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettingsState: (newSettings: Partial<ConstituencySettings>) => void;
  label: (suffix?: string) => string;
  representativeType: RepresentativeType;
  portalName: string;
  isMP: boolean;
  isMLA: boolean;
  hasRural: (assemblyId?: string) => boolean;
  hasUrban: (assemblyId?: string) => boolean;
  getActiveAssemblyConstituencies: () => AssemblyConstituencyConfig[];
  getActiveAreaTypes: (assemblyId?: string) => Array<'RURAL' | 'URBAN'>;
  getOrganizationRootLabel: () => string;
}

const defaultSettings: ConstituencySettings = {
  id: 1,
  representativeType: 'MLA',
  portalName: 'Korei MLA Constituency Portal',
  representativeName: 'Shri Akash Dasnayak',
  constituencyName: 'Korei Assembly',
  stateName: 'Odisha',
  districtName: 'Jajpur',
  lokSabhaName: 'Jajpur (SC) Lok Sabha',
  lokSabhaId: 'ls-jajpur',
  assemblyName: 'Korei Assembly',
  assemblyId: 'ac-korei',
  ruralEnabled: true,
  urbanEnabled: true,
  assemblyConstituencies: [
    { id: 'ac-korei', name: 'Korei Assembly', ruralEnabled: true, urbanEnabled: true, districtName: 'Jajpur' },
    { id: 'ac-jajpur', name: 'Jajpur Assembly', ruralEnabled: true, urbanEnabled: true, districtName: 'Jajpur' },
    { id: 'ac-bari', name: 'Bari Assembly', ruralEnabled: true, urbanEnabled: false, districtName: 'Jajpur' },
    { id: 'ac-barchana', name: 'Barchana Assembly', ruralEnabled: true, urbanEnabled: true, districtName: 'Jajpur' },
    { id: 'ac-dharmasala', name: 'Dharmasala Assembly', ruralEnabled: true, urbanEnabled: false, districtName: 'Jajpur' },
    { id: 'ac-sukinda', name: 'Sukinda Assembly', ruralEnabled: true, urbanEnabled: false, districtName: 'Jajpur' },
    { id: 'ac-binjharpur', name: 'Binjharpur Assembly', ruralEnabled: true, urbanEnabled: true, districtName: 'Jajpur' },
  ],
  representativeMobileDisplay: '+91 94370 12345',
  officeAddress: 'Main Constituency Office, Near Collectorate, Jajpur, Odisha - 755001',
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: false,
  refreshSettings: async () => {},
  updateSettingsState: () => {},
  label: (suffix) => (suffix ? `MLA ${suffix}` : 'MLA'),
  representativeType: 'MLA',
  portalName: 'MLA Constituency Portal',
  isMP: false,
  isMLA: true,
  hasRural: () => true,
  hasUrban: () => true,
  getActiveAssemblyConstituencies: () => [],
  getActiveAreaTypes: () => ['RURAL', 'URBAN'],
  getOrganizationRootLabel: () => 'Korei Assembly',
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ConstituencySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await ApiClient.get<ConstituencySettings>('settings');
      if (data) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn('Could not fetch constituency settings, using defaults.', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const updateSettingsState = (newSettings: Partial<ConstituencySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const isMP = settings?.representativeType === 'MP';
  const isMLA = !isMP;

  const label = useCallback(
    (suffix?: string) => {
      const rep = settings?.representativeType || 'MLA';
      if (!suffix) return rep;
      return `${rep} ${suffix}`;
    },
    [settings?.representativeType],
  );

  const portalName =
    settings?.portalName ||
    `${settings?.representativeType || 'MLA'} Constituency Portal`;

  const getActiveAssemblyConstituencies = useCallback((): AssemblyConstituencyConfig[] => {
    if (isMP) {
      return (
        settings?.assemblyConstituencies || [
          { id: 'ac-korei', name: 'Korei Assembly', ruralEnabled: true, urbanEnabled: true },
          { id: 'ac-jajpur', name: 'Jajpur Assembly', ruralEnabled: true, urbanEnabled: true },
        ]
      );
    }
    return [
      {
        id: settings?.assemblyId || 'ac-korei',
        name: settings?.assemblyName || settings?.constituencyName || 'Korei Assembly',
        ruralEnabled: settings?.ruralEnabled ?? true,
        urbanEnabled: settings?.urbanEnabled ?? true,
      },
    ];
  }, [isMP, settings]);

  const hasRural = useCallback(
    (assemblyId?: string): boolean => {
      if (isMLA) {
        return settings?.ruralEnabled ?? true;
      }
      if (!assemblyId || assemblyId === 'ALL') return true;
      const ac = settings?.assemblyConstituencies?.find((item) => item.id === assemblyId);
      return ac ? ac.ruralEnabled : true;
    },
    [isMLA, settings],
  );

  const hasUrban = useCallback(
    (assemblyId?: string): boolean => {
      if (isMLA) {
        return settings?.urbanEnabled ?? true;
      }
      if (!assemblyId || assemblyId === 'ALL') return true;
      const ac = settings?.assemblyConstituencies?.find((item) => item.id === assemblyId);
      return ac ? ac.urbanEnabled : true;
    },
    [isMLA, settings],
  );

  const getActiveAreaTypes = useCallback(
    (assemblyId?: string): Array<'RURAL' | 'URBAN'> => {
      const types: Array<'RURAL' | 'URBAN'> = [];
      if (hasRural(assemblyId)) types.push('RURAL');
      if (hasUrban(assemblyId)) types.push('URBAN');
      return types.length > 0 ? types : ['RURAL', 'URBAN'];
    },
    [hasRural, hasUrban],
  );

  const getOrganizationRootLabel = useCallback((): string => {
    if (isMP) {
      return settings?.lokSabhaName || `${settings?.constituencyName || 'Jajpur'} Lok Sabha`;
    }
    return settings?.assemblyName || `${settings?.constituencyName || 'Korei'} Assembly`;
  }, [isMP, settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings,
        updateSettingsState,
        label,
        representativeType: settings?.representativeType || 'MLA',
        portalName,
        isMP,
        isMLA,
        hasRural,
        hasUrban,
        getActiveAssemblyConstituencies,
        getActiveAreaTypes,
        getOrganizationRootLabel,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useConstituencySettings() {
  return useContext(SettingsContext);
}
