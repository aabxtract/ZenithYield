"use client";
import { useYieldZenithContext } from "@/hooks/use-yield-zenith-provider";
import { PoolManagementCard } from "./pool-management-card";

export function PoolManagementList() {
    const { poolStates } = useYieldZenithContext();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.values(poolStates).map(poolData => (
                <PoolManagementCard key={poolData.pool.id} poolData={poolData} />
            ))}
        </div>
    );
}
