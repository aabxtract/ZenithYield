"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useGovernance, Proposal } from './use-governance';

type GovernanceContextType = ReturnType<typeof useGovernance>;

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

export const GovernanceProvider = ({ children }: { children: ReactNode }) => {
  const governanceData = useGovernance();
  return (
    <GovernanceContext.Provider value={governanceData}>
      {children}
    </GovernanceContext.Provider>
  );
};

export const useGovernanceContext = () => {
  const context = useContext(GovernanceContext);
  if (context === undefined) {
    throw new Error('useGovernanceContext must be used within a GovernanceProvider');
  }
  return context;
};
