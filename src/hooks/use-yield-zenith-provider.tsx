"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useYieldZenith, PoolData } from './use-yield-zenith';

interface YieldZenithContextType {
  poolStates: Record<string, PoolData>;
  getPoolData: (poolId: string) => PoolData | undefined;
  stake: (poolId: string, amount: number) => Promise<void>;
  unstake: (poolId: string, amount: number) => Promise<void>;
  claim: (poolId: string) => Promise<void>;
  zapIn: (poolId: string, assetSymbol: string, amount: number) => Promise<void>;
  isStaking: (poolId: string) => boolean;
  isUnstaking: (poolId: string) => boolean;
  isClaiming: (poolId: string) => boolean;
  isZapping: (poolId: string) => boolean;
  // Admin functions
  fundPool: (poolId: string, amount: number) => Promise<void>;
  setPoolApy: (poolId: string, newApy: number) => Promise<void>;
  togglePoolStatus: (poolId: string) => Promise<void>;
  isFunding: (poolId: string) => boolean;
  isSettingApy: (poolId: string) => boolean;
  isTogglingStatus: (poolId: string) => boolean;
}

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
