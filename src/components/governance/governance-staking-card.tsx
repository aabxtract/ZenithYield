"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGovernanceContext } from '@/hooks/use-governance-provider';
import { REWARD_TOKEN_SYMBOL } from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function GovernanceStakingCard() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const {
    stakeZen,
    unstakeZen,
    isStaking,
    isUnstaking,
    zenBalance,
    stakedZen,
  } = useGovernanceContext();

  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (!isNaN(amount) && amount > 0) {
      stakeZen(amount).then(() => setStakeAmount(''));
    }
  };

  const handleUnstake = () => {
    const amount = parseFloat(unstakeAmount);
    if (!isNaN(amount) && amount > 0) {
      unstakeZen(amount).then(() => setUnstakeAmount(''));
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Stake {REWARD_TOKEN_SYMBOL} for ve{REWARD_TOKEN_SYMBOL}</CardTitle>
        <CardDescription>Lock your {REWARD_TOKEN_SYMBOL} to gain voting power.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stake">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stake">Stake</TabsTrigger>
            <TabsTrigger value="unstake">Unstake</TabsTrigger>
          </TabsList>
          <TabsContent value="stake" className="space-y-4 pt-4">
             <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="stake-amount" className="text-sm font-medium">Amount</label>
                  <span className="text-sm text-muted-foreground">Balance: {zenBalance.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <Input id="stake-amount" type="number" placeholder="0.0" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} className="pr-20" />
                  <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7" onClick={() => setStakeAmount(zenBalance.toString())}>Max</Button>
                </div>
              </div>
              <Button onClick={handleStake} disabled={isStaking || !stakeAmount} className="w-full">
                {isStaking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isStaking ? 'Staking...' : 'Stake ZEN'}
              </Button>
          </TabsContent>
          <TabsContent value="unstake" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label htmlFor="unstake-amount" className="text-sm font-medium">Amount</label>
                <span className="text-sm text-muted-foreground">Staked: {stakedZen.toLocaleString()}</span>
              </div>
              <div className="relative">
                <Input id="unstake-amount" type="number" placeholder="0.0" value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} className="pr-20" />
                <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7" onClick={() => setUnstakeAmount(stakedZen.toString())}>Max</Button>
              </div>
            </div>
            <Button onClick={handleUnstake} disabled={isUnstaking || !unstakeAmount} className="w-full" variant="outline">
              {isUnstaking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUnstaking ? 'Unstaking...' : 'Unstake ZEN'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
