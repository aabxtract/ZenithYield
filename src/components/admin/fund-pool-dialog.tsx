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
import type { Pool } from '@/lib/constants';
import { Loader2, Droplets } from 'lucide-react';
import { Label } from '../ui/label';

interface FundPoolDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pool: Pool;
}

export function FundPoolDialog({ isOpen, onOpenChange, pool }: FundPoolDialogProps) {
  const [amount, setAmount] = useState('');
  const { fundPool, isFunding } = useYieldZenithContext();

  const handleFund = () => {
    const fundAmount = parseFloat(amount);
    if (!isNaN(fundAmount) && fundAmount > 0) {
      fundPool(pool.id, fundAmount).then(() => {
        setAmount('');
        onOpenChange(false);
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fund {pool.lpTokenName} Pool</DialogTitle>
          <DialogDescription>
            Add reward tokens ({pool.rewardTokenSymbol}) to the pool. This will be distributed to stakers over time.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
            <Label htmlFor="fund-amount">Amount to Add</Label>
            <Input
                id="fund-amount"
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleFund} disabled={isFunding(pool.id) || !amount}>
            {isFunding(pool.id) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Droplets className="mr-2 h-4 w-4" />}
            {isFunding(pool.id) ? 'Funding...' : 'Confirm Funding'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
