'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isOpen: boolean; // Mobile drawer open
  isCollapsed: boolean; // Desktop collapsed
  toggleOpen: () => void;
  toggleCollapsed: () => void;
  setIsOpen: (open: boolean) => void;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  isCollapsed: false,
  toggleOpen: () => {},
  toggleCollapsed: () => {},
  setIsOpen: () => {},
  setIsCollapsed: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load user preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('mla_sidebar_collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('mla_sidebar_collapsed', String(next));
      return next;
    });
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <SidebarContext.Provider
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
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
