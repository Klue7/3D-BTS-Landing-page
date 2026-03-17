import React, { createContext, useContext, useState } from 'react';

interface VisualLabState {
  activeGrout: string;
  setActiveGrout: (id: string) => void;
  activeLayout: string;
  setActiveLayout: (id: string) => void;
  activeLighting: string;
  setActiveLighting: (id: string) => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const VisualLabContext = createContext<VisualLabState | undefined>(undefined);

export function VisualLabProvider({ children }: { children: React.ReactNode }) {
  const [activeGrout, setActiveGrout] = useState('light');
  const [activeLayout, setActiveLayout] = useState('stretcher');
  const [activeLighting, setActiveLighting] = useState('daylight');
  const [currentSection, setCurrentSection] = useState('hero');

  return (
    <VisualLabContext.Provider value={{
      activeGrout, setActiveGrout,
      activeLayout, setActiveLayout,
      activeLighting, setActiveLighting,
      currentSection, setCurrentSection
    }}>
      {children}
    </VisualLabContext.Provider>
  );
}

export function useVisualLab() {
  const context = useContext(VisualLabContext);
  if (!context) {
    throw new Error('useVisualLab must be used within a VisualLabProvider');
  }
  return context;
}
