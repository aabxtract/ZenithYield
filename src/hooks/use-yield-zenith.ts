"use client";

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/context/wallet-context';
import { APY, INITIAL_TVL } from '@/lib/constants';
import { useToast } from './use-toast';

export const useYieldZenith = () => {
  const { isConnected } = useWallet();
  const { toast } = useToast();

  const [stakedBalance, setStakedBalance] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [tvl, setTvl] = useState(INITIAL_TVL);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  
  // Fake LP token balance for the user
  const [lpTokenBalance, setLpTokenBalance] = useState(1000);

  useEffect(() => {
    if (!isConnected) {
      setStakedBalance(0);
      setRewards(0);
    }
  }, [isConnected]);

  useEffect(() => {
    if (stakedBalance > 0 && isConnected) {
      const rewardsPerSecond = (stakedBalance * APY) / (365 * 24 * 60 * 60);
      const interval = setInterval(() => {
        setRewards(prevRewards => prevRewards + rewardsPerSecond);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stakedBalance, isConnected]);

  const stake = useCallback(async (amount: number) => {
    if (amount <= 0 || amount > lpTokenBalance) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake.",
      });
      return;
    }
    setIsStaking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStakedBalance(prev => prev + amount);
    setTvl(prev => prev + amount);
    setLpTokenBalance(prev => prev - amount);
    setIsStaking(false);
    toast({
      title: "Staked Successfully",
      description: `You have staked ${amount} LP tokens.`,
    });
  }, [lpTokenBalance, toast]);

  const unstake = useCallback(async (amount: number) => {
    if (amount <= 0 || amount > stakedBalance) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "You cannot unstake more than your staked balance.",
      });
      return;
    }
    setIsUnstaking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStakedBalance(prev => prev - amount);
    setTvl(prev => prev - amount);
    setLpTokenBalance(prev => prev + amount);
    setIsUnstaking(false);
    toast({
      title: "Unstaked Successfully",
      description: `You have unstaked ${amount} LP tokens.`,
    });
  }, [stakedBalance, toast]);

  const claim = useCallback(async () => {
    if (rewards <= 0) {
      toast({
        variant: "destructive",
        title: "No Rewards to Claim",
        description: "You have no rewards to claim yet.",
      });
      return;
    }
    setIsClaiming(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const claimedAmount = rewards;
    setRewards(0);
    setIsClaiming(false);
    toast({
      title: "Rewards Claimed",
      description: `You have claimed ${claimedAmount.toFixed(6)} ZEN.`,
    });
  }, [rewards, toast]);

  return {
    stakedBalance,
    rewards,
    tvl,
    apy: APY,
    lpTokenBalance,
    stake,
    unstake,
    claim,
    isStaking,
    isUnstaking,
    isClaiming,
  };
};
