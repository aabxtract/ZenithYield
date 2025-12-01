"use client"

import { TvlChart } from "./tvl-chart";
import { ApyChart } from "./apy-chart";
import { RewardsChart } from "./rewards-chart";

export function AnalyticsCharts() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="xl:col-span-2">
                <TvlChart />
            </div>
            <div>
                <ApyChart />
            </div>
            <div>
                <RewardsChart />
            </div>
        </div>
    )
}
