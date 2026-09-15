'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface MobileSidebarContextType {
  isOpen: boolean; // Mobile drawer open
  isCollapsed: boolean; // Desktop collapsed
  toggleOpen: () => void;
  toggleCollapsed: () => void;
  setIsOpen: (open: boolean) => void;
  setIsCollapsed: (collapsed: boolean) => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextType>({
  isOpen: false,
  isCollapsed: false,
  toggleOpen: () => {},
  toggleCollapsed: () => {},
  setIsOpen: () => {},
  setIsCollapsed: () => {},
});

export function MobileSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load user preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('mobile_sidebar_collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('mobile_sidebar_collapsed', String(next));
      return next;
    });
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <MobileSidebarContext.Provider
      value={{
        isOpen,
        isCollapsed,
        toggleOpen,
        toggleCollapsed,
        setIsOpen,
        setIsCollapsed,
      }}
    >
      {children}
    </MobileSidebarContext.Provider>
  );
}

export function useMobileSidebar() {
  return useContext(MobileSidebarContext);
}
