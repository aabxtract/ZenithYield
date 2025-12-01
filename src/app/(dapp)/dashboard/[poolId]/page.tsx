"use client";

import { useWallet } from '@/context/wallet-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import StatsGrid from '@/components/dashboard/stats-grid';
import { StakingCard } from '@/components/dashboard/staking-card';
import { UserBalanceCard } from '@/components/dashboard/user-balance-card';
import { POOLS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PoolDashboardPage({ params }: { params: { poolId: string } }) {
  const { isConnected, connectWallet } = useWallet();
  const pool = POOLS.find(p => p.id === params.poolId);

  if (!pool) {
    notFound();
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md w-full text-center shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Wallet className="text-primary" />
              Welcome to YieldZenith
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Connect your wallet to stake in the {pool.lpTokenName} pool.
            </p>
            <button
              onClick={connectWallet}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
            >
              Connect Wallet
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
                <Link href="/pools">
                    <ArrowLeft />
                </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{pool.lpTokenName} Pool</h1>
        </div>
      <StatsGrid poolId={pool.id} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StakingCard poolId={pool.id} />
        <UserBalanceCard poolId={pool.id} />
      </div>
    </div>
  );
}
