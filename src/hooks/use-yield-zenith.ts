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

type LoadingState = 'staking' | 'unstaking' | 'claiming' | 'funding' | 'settingApy' | 'togglingStatus';

export const useYieldZenith = () => {
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [poolStates, setPoolStates] = useState<PoolState>(initializeState);
  
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState | null>>({});

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
          if (poolState.stakedBalance > 0 && poolState.pool.active) {
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
  
  const setLoadingState = (poolId: string, state: LoadingState | null) => {
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
    if (!poolState.pool.active) {
        toast({ variant: "destructive", title: "Pool Inactive", description: "This pool is currently not accepting new stakes." });
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

  // Admin functions
  const fundPool = useCallback(async (poolId: string, amount: number) => {
    const poolState = poolStates[poolId];
    if (!poolState || amount <= 0) {
        toast({ variant: "destructive", title: "Invalid Amount" });
        return;
    }
    setLoadingState(poolId, 'funding');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPoolStates(prev => ({
        ...prev,
        [poolId]: {
            ...poolState,
            pool: { ...poolState.pool, totalRewards: poolState.pool.totalRewards + amount }
        }
    }));
    setLoadingState(poolId, null);
    toast({ title: "Pool Funded", description: `Added ${amount} ${poolState.pool.rewardTokenSymbol} to the reward pool.` });
  }, [poolStates, toast]);

  const setPoolApy = useCallback(async (poolId: string, newApy: number) => {
    const poolState = poolStates[poolId];
    if (!poolState || newApy < 0) {
        toast({ variant: "destructive", title: "Invalid APY" });
        return;
    }
    setLoadingState(poolId, 'settingApy');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPoolStates(prev => ({
        ...prev,
        [poolId]: {
            ...poolState,
            pool: { ...poolState.pool, apy: newApy }
        }
    }));
    setLoadingState(poolId, null);
    toast({ title: "APY Updated", description: `APY for ${poolState.pool.lpTokenName} set to ${(newApy * 100).toFixed(2)}%.` });
  }, [poolStates, toast]);

  const togglePoolStatus = useCallback(async (poolId: string) => {
    const poolState = poolStates[poolId];
    if (!poolState) return;

    setLoadingState(poolId, 'togglingStatus');
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStatus = !poolState.pool.active;
    setPoolStates(prev => ({
        ...prev,
        [poolId]: {
            ...poolState,
            pool: { ...poolState.pool, active: newStatus }
        }
    }));
    setLoadingState(poolId, null);
    toast({ title: `Pool ${newStatus ? 'Resumed' : 'Paused'}`, description: `${poolState.pool.lpTokenName} is now ${newStatus ? 'active' : 'inactive'}.` });
  }, [poolStates, toast]);
  
  const getPoolData = useCallback((poolId: string) => poolStates[poolId], [poolStates]);

  const isStaking = (poolId: string) => loadingStates[poolId] === 'staking';
  const isUnstaking = (poolId: string) => loadingStates[poolId] === 'unstaking';
  const isClaiming = (poolId: string) => loadingStates[poolId] === 'claiming';
  const isFunding = (poolId: string) => loadingStates[poolId] === 'funding';
  const isSettingApy = (poolId: string) => loadingStates[poolId] === 'settingApy';
  const isTogglingStatus = (poolId: string) => loadingStates[poolId] === 'togglingStatus';

  return {
    poolStates,
    getPoolData,
    stake,
    unstake,
    claim,
    isStaking,
    isUnstaking,
    isClaiming,
    // Admin
    fundPool,
    setPoolApy,
    togglePoolStatus,
    isFunding,
    isSettingApy,
    isTogglingStatus,
  };
};
