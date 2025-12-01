"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useYieldZenithContext } from '@/hooks/use-yield-zenith-provider';
import { Loader2 } from 'lucide-react';

interface UnstakeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  poolId: string;
}

export function UnstakeModal({ isOpen, onOpenChange, poolId }: UnstakeModalProps) {
  const [amount, setAmount] = useState('');
  const { unstake, isUnstaking, getPoolData } = useYieldZenithContext();
  const poolData = getPoolData(poolId);

  if (!poolData) return null;

  const { stakedBalance } = poolData;

  const handleUnstake = () => {
    const unstakeAmount = parseFloat(amount);
    if (!isNaN(unstakeAmount) && unstakeAmount > 0) {
      unstake(poolId, unstakeAmount).then(() => {
        setAmount('');
        onOpenChange(false);
      });
    }
  };

  const handleMaxClick = () => {
    setAmount(stakedBalance.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unstake {poolData.pool.lpTokenSymbol} Tokens</DialogTitle>
          <DialogDescription>
            Choose how many LP tokens you want to withdraw from the pool.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <div className="flex justify-between items-baseline">
            <label htmlFor="unstake-amount" className="text-sm font-medium">
              Amount to Unstake
            </label>
            <span className="text-sm text-muted-foreground">
              Staked: {stakedBalance.toLocaleString()}
            </span>
          </div>
          <div className="relative">
            <Input
              id="unstake-amount"
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleUnstake} disabled={isUnstaking(poolId) || !amount}>
            {isUnstaking(poolId) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isUnstaking(poolId) ? 'Unstaking...' : 'Confirm Unstake'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
