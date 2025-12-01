"use client";

import { useWallet } from '@/context/wallet-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import StatsGrid from '@/components/dashboard/stats-grid';
import { StakingCard } from '@/components/dashboard/staking-card';
import { UserBalanceCard } from '@/components/dashboard/user-balance-card';
import { YieldZenithProvider } from '@/hooks/use-yield-zenith-provider';

export default function DashboardPage() {
  const { isConnected, connectWallet } = useWallet();

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
              Connect your wallet to start staking and earning rewards.
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
    <YieldZenithProvider>
      <div className="flex flex-col gap-6">
        <StatsGrid />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StakingCard />
          <UserBalanceCard />
        </div>
      </div>
    </YieldZenithProvider>
  );
}
