"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Percent, Landmark } from 'lucide-react';
import { useYieldZenithContext } from '@/hooks/use-yield-zenith-provider';

export default function StatsGrid({ poolId }: { poolId: string }) {
  const { getPoolData } = useYieldZenithContext();
  const poolData = getPoolData(poolId);

  if (!poolData) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader></Card>
            <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader></Card>
            <Card><CardHeader><CardTitle>Loading...</CardTitle></CardHeader></Card>
        </div>
    );
  }

  const { pool, tvl, stakedBalance } = poolData;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value Locked (TVL)</CardTitle>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(tvl)}</div>
          <p className="text-xs text-muted-foreground">Total funds in this pool</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Annual Percentage Yield</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(pool.apy * 100).toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">Fixed reward rate</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Staked Balance</CardTitle>
          <Landmark className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stakedBalance.toLocaleString('en-US', { maximumFractionDigits: 4 })} {pool.lpTokenSymbol}
          </div>
          <p className="text-xs text-muted-foreground">Your total staked assets in this pool</p>
        </CardContent>
      </Card>
    </div>
  );
}
