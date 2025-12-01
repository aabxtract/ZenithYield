"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Lock, Library } from 'lucide-react';
import { useGovernanceContext } from '@/hooks/use-governance-provider';

export function GovernanceStats() {
  const { totalZenStaked, votingPower, proposalCount } = useGovernanceContext();

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total ZEN Staked</CardTitle>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalZenStaked)}</div>
          <p className="text-xs text-muted-foreground">Locked for voting power</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Voting Power</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(votingPower)} veZEN</div>
          <p className="text-xs text-muted-foreground">Your influence in proposals</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Proposals</CardTitle>
          <Library className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{proposalCount}</div>
          <p className="text-xs text-muted-foreground">Total proposals submitted</p>
        </CardContent>
      </Card>
    </div>
  );
}
