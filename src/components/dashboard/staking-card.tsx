"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useYieldZenithContext } from '@/hooks/use-yield-zenith-provider';
import { Loader2 } from 'lucide-react';

export function StakingCard({ poolId }: { poolId: string }) {
  const [amount, setAmount] = useState('');
  const { stake, isStaking, getPoolData } = useYieldZenithContext();
  const poolData = getPoolData(poolId);

  if (!poolData) return null;

  const handleStake = () => {
    const stakeAmount = parseFloat(amount);
    if (!isNaN(stakeAmount) && stakeAmount > 0) {
      stake(poolId, stakeAmount).then(() => setAmount(''));
    }
  };
  
  const handleMaxClick = () => {
    setAmount(poolData.lpTokenBalance.toString());
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Stake {poolData.pool.lpTokenName}</CardTitle>
        <CardDescription>Deposit your {poolData.pool.lpTokenSymbol} tokens to earn rewards.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label htmlFor="stake-amount" className="text-sm font-medium">
              Amount
            </label>
            <span className="text-sm text-muted-foreground">
              Balance: {poolData.lpTokenBalance.toLocaleString()}
            </span>
          </div>
          <div className="relative">
            <Input
              id="stake-amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-20"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
              onClick={handleMaxClick}
            >
              Max
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStake} disabled={isStaking(poolId) || !amount} className="w-full">
          {isStaking(poolId) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isStaking(poolId) ? 'Staking...' : 'Stake'}
        </Button>
      </CardFooter>
    </Card>
  );
}
