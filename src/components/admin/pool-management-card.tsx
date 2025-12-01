"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { PoolData } from "@/hooks/use-yield-zenith";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Droplets, CircleDollarSign, Pencil, Power, PowerOff } from "lucide-react";
import { useYieldZenithContext } from "@/hooks/use-yield-zenith-provider";
import { FundPoolDialog } from "./fund-pool-dialog";
import { EditApyDialog } from "./edit-apy-dialog";

interface PoolManagementCardProps {
    poolData: PoolData;
}

export function PoolManagementCard({ poolData }: PoolManagementCardProps) {
    const { pool, tvl } = poolData;
    const { togglePoolStatus } = useYieldZenithContext();

    const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
    const [isEditApyDialogOpen, setIsEditApyDialogOpen] = useState(false);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle>{pool.lpTokenName}</CardTitle>
                        <Badge variant={pool.active ? "secondary" : "destructive"} className={cn(pool.active && "bg-green-500/20 text-green-700")}>
                            {pool.active ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                    <CardDescription>ID: {pool.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><CircleDollarSign className="w-4 h-4" /> TVL</span>
                        <span className="font-semibold">${tvl.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2"><Droplets className="w-4 h-4" /> Reward Pool</span>
                        <span className="font-semibold">{pool.totalRewards.toLocaleString()} {pool.rewardTokenSymbol}</span>
                    </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setIsFundDialogOpen(true)}>
                        <Droplets className="mr-2 h-4 w-4" /> Fund
                    </Button>
                     <Button variant="outline" onClick={() => togglePoolStatus(pool.id)}>
                        {pool.active ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
                        {pool.active ? "Pause" : "Resume"}
                    </Button>
                    <Button variant="outline" className="col-span-2" onClick={() => setIsEditApyDialogOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit APY
                    </Button>
                </CardFooter>
            </Card>
            <FundPoolDialog isOpen={isFundDialogOpen} onOpenChange={setIsFundDialogOpen} pool={pool} />
            <EditApyDialog isOpen={isEditApyDialogOpen} onOpenChange={setIsEditApyDialogOpen} pool={pool} />
        </>
    );
}
