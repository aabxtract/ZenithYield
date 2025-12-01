"use client";

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/context/wallet-context';
import { POOLS, Pool } from '@/lib/constants';
import { useToast } from './use-toast';

export interface PoolData {
  pool: Pool;
  stakedBalance: number;
  rewards: number;
  tvl: number;
  lpTokenBalance: number;
}

export type PoolState = Record<string, PoolData>;

const initializeState = (): PoolState => {
  const state: PoolState = {};
  POOLS.forEach(pool => {
    state[pool.id] = {
      pool,
      stakedBalance: 0,
      rewards: 0,
      tvl: pool.initialTvl,
      lpTokenBalance: 1000, // Dummy balance for each pool
    };
  });
  return state;
};

export const useYieldZenith = () => {
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [poolStates, setPoolStates] = useState<PoolState>(initializeState);
  
  const [loadingStates, setLoadingStates] = useState<Record<string, 'staking' | 'unstaking' | 'claiming' | null>>({});

  useEffect(() => {
    if (!isConnected) {
      setPoolStates(initializeState());
    }
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setPoolStates(currentStates => {
        const newStates = { ...currentStates };
        let hasChanged = false;
        for (const poolId in newStates) {
          const poolState = newStates[poolId];
          if (poolState.stakedBalance > 0) {
            const rewardsPerSecond = (poolState.stakedBalance * poolState.pool.apy) / (365 * 24 * 60 * 60);
            newStates[poolId] = {
              ...poolState,
              rewards: poolState.rewards + rewardsPerSecond,
            };
            hasChanged = true;
          }
        }
        return hasChanged ? newStates : currentStates;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);
  
  const setLoadingState = (poolId: string, state: 'staking' | 'unstaking' | 'claiming' | null) => {
    setLoadingStates(prev => ({...prev, [poolId]: state}));
  }

  const stake = useCallback(async (poolId: string, amount: number) => {
    const poolState = poolStates[poolId];
    if (!poolState || amount <= 0 || amount > poolState.lpTokenBalance) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake.",
      });
      return;
    }
    setLoadingState(poolId, 'staking');
    await new Promise(resolve => setTimeout(resolve, 1500));

    setPoolStates(prev => ({
      ...prev,
      [poolId]: {
        ...poolState,
        stakedBalance: poolState.stakedBalance + amount,
        tvl: poolState.tvl + amount, // This is a simplification
        lpTokenBalance: poolState.lpTokenBalance - amount,
      }
    }));
    
    setLoadingState(poolId, null);
    toast({
      title: "Staked Successfully",
      description: `You have staked ${amount} ${poolState.pool.lpTokenSymbol}.`,
    });
  }, [poolStates, toast]);

  const unstake = useCallback(async (poolId: string, amount: number) => {
    const poolState = poolStates[poolId];
    if (!poolState || amount <= 0 || amount > poolState.stakedBalance) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "You cannot unstake more than your staked balance.",
      });
      return;
    }
    setLoadingState(poolId, 'unstaking');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPoolStates(prev => ({
      ...prev,
      [poolId]: {
        ...poolState,
        stakedBalance: poolState.stakedBalance - amount,
        tvl: poolState.tvl - amount, // This is a simplification
        lpTokenBalance: poolState.lpTokenBalance + amount,
      }
    }));
    setLoadingState(poolId, null);
    toast({
      title: "Unstaked Successfully",
      description: `You have unstaked ${amount} ${poolState.pool.lpTokenSymbol}.`,
    });
  }, [poolStates, toast]);

  const claim = useCallback(async (poolId: string) => {
    const poolState = poolStates[poolId];
    if (!poolState || poolState.rewards <= 0) {
      toast({
        variant: "destructive",
        title: "No Rewards to Claim",
        description: "You have no rewards to claim yet.",
      });
      return;
    }
    setLoadingState(poolId, 'claiming');
    await new Promise(resolve => setTimeout(resolve, 1500));
    const claimedAmount = poolState.rewards;
    
    setPoolStates(prev => ({
      ...prev,
      [poolId]: {
        ...poolState,
        rewards: 0,
      }
    }));
    setLoadingState(poolId, null);
    toast({
      title: "Rewards Claimed",
      description: `You have claimed ${claimedAmount.toFixed(6)} ${poolState.pool.rewardTokenSymbol}.`,
    });
  }, [poolStates, toast]);
  
  const getPoolData = useCallback((poolId: string) => poolStates[poolId], [poolStates]);

  const isStaking = (poolId: string) => loadingStates[poolId] === 'staking';
  const isUnstaking = (poolId: string) => loadingStates[poolId] === 'unstaking';
  const isClaiming = (poolId: string) => loadingStates[poolId] === 'claiming';

  return {
    poolStates,
    getPoolData,
    stake,
    unstake,
    claim,
    isStaking,
    isUnstaking,
    isClaiming,
  };
};
