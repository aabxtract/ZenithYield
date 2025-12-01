"use client";

import { GovernanceProvider } from '@/hooks/use-governance-provider';
import { GovernanceStats } from '@/components/governance/governance-stats';
import { GovernanceStakingCard } from '@/components/governance/governance-staking-card';
import { ProposalsList } from '@/components/governance/proposals-list';
import { useWallet } from '@/context/wallet-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

export default function GovernancePage() {
    const { isConnected, connectWallet } = useWallet();

    if (!isConnected) {
        return (
          <div className="flex items-center justify-center h-full">
            <Card className="max-w-md w-full text-center shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Wallet className="text-primary" />
                  Connect Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect your wallet to participate in governance.
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
    <GovernanceProvider>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Governance</h1>
        <GovernanceStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <ProposalsList />
            </div>
            <div>
                <GovernanceStakingCard />
            </div>
        </div>
      </div>
    </GovernanceProvider>
  );
}
