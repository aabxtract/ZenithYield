"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useYieldZenith } from './use-yield-zenith';

type YieldZenithContextType = ReturnType<typeof useYieldZenith>;

const YieldZenithContext = createContext<YieldZenithContextType | undefined>(undefined);

export const YieldZenithProvider = ({ children }: { children: ReactNode }) => {
  const yieldZenithData = useYieldZenith();
  return (
    <YieldZenithContext.Provider value={yieldZenithData}>
      {children}
    </YieldZenithContext.Provider>
  );
};

export const useYieldZenithContext = () => {
  const context = useContext(YieldZenithContext);
  if (context === undefined) {
    throw new Error('useYieldZenithContext must be used within a YieldZenithProvider');
  }
  return context;
};
