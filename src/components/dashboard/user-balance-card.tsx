"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useYieldZenithContext } from '@/hooks/use-yield-zenith-provider';
import { Loader2 } from 'lucide-react';
import { UnstakeModal } from './unstake-modal';

export function UserBalanceCard({ poolId }: { poolId: string }) {
  const { claim, isClaiming, getPoolData } = useYieldZenithContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const poolData = getPoolData(poolId);

  if (!poolData) return null;

  const { stakedBalance, rewards } = poolData;
  const { lpTokenSymbol, rewardTokenSymbol } = poolData.pool;

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <CardHeader>
          <CardTitle>Your Position</CardTitle>
          <CardDescription>Manage your staked assets and claim rewards.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-6">
          <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Staked Balance</p>
              <p className="text-2xl font-semibold">
                {stakedBalance.toLocaleString('en-US', { maximumFractionDigits: 4 })} {lpTokenSymbol}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Accumulated Rewards</p>
              <p className="text-2xl font-semibold text-primary">
                {rewards.toLocaleString('en-US', { maximumFractionDigits: 6 })} {rewardTokenSymbol}
              </p>
            </div>
            <Button onClick={() => claim(poolId)} disabled={isClaiming(poolId) || rewards <= 0}>
              {isClaiming(poolId) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isClaiming(poolId) ? 'Claiming...' : 'Claim'}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsModalOpen(true)}
            disabled={stakedBalance <= 0}
          >
            Unstake
          </Button>
        </CardFooter>
      </Card>
      <UnstakeModal poolId={poolId} isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
