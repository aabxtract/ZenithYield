"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { POOLS } from "@/lib/constants";
import { useYieldZenithContext } from "@/hooks/use-yield-zenith-provider";
import Link from "next/link";
import { ArrowRight, Lock, Percent, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PoolsPage() {
    const { getPoolData } = useYieldZenithContext();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Staking Pools</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {POOLS.map(pool => {
                    const poolData = getPoolData(pool.id);

                    return (
                        <Card key={pool.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>{pool.lpTokenName}</CardTitle>
                                    <Badge variant="secondary">{pool.rewardTokenSymbol} Rewards</Badge>
                                </div>
                                <CardDescription>Stake {pool.lpTokenSymbol} and earn {pool.rewardTokenSymbol}.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><Percent className="w-4 h-4" /> APY</span>
                                    <span className="font-semibold text-primary">{(pool.apy * 100).toFixed(2)}%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><Lock className="w-4 h-4" /> TVL</span>
                                    <span className="font-semibold">${poolData?.tvl.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><Landmark className="w-4 h-4" /> Your Stake</span>
                                    <span className="font-semibold">{poolData?.stakedBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/dashboard/${pool.id}`}>
                                        Go to Pool
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
