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
import { Loader2, Pencil, Percent } from 'lucide-react';
import { Label } from '../ui/label';

interface EditApyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pool: Pool;
}

export function EditApyDialog({ isOpen, onOpenChange, pool }: EditApyDialogProps) {
  const [newApy, setNewApy] = useState((pool.apy * 100).toString());
  const { setPoolApy, isSettingApy } = useYieldZenithContext();

  const handleSetApy = () => {
    const apyValue = parseFloat(newApy);
    if (!isNaN(apyValue) && apyValue >= 0) {
      setPoolApy(pool.id, apyValue / 100).then(() => {
        onOpenChange(false);
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit APY for {pool.lpTokenName}</DialogTitle>
          <DialogDescription>
            Adjust the Annual Percentage Yield for this staking pool.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
            <Label htmlFor="apy-amount">New APY (%)</Label>
            <div className="relative">
                <Input
                    id="apy-amount"
                    type="number"
                    placeholder="25.0"
                    value={newApy}
                    onChange={(e) => setNewApy(e.target.value)}
                    className="pr-8"
                />
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSetApy} disabled={isSettingApy(pool.id) || !newApy}>
            {isSettingApy(pool.id) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Pencil className="mr-2 h-4 w-4" />}
            {isSettingApy(pool.id) ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
