"use client"

import { Gift } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { historicalRewards } from "@/lib/historical-data"
import { REWARD_TOKEN_SYMBOL } from "@/lib/constants"

const chartConfig = {
  rewards: {
    label: `Rewards (${REWARD_TOKEN_SYMBOL})`,
    color: "hsl(var(--primary))",
  },
}

export function RewardsChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Your Accrued Rewards</CardTitle>
        <CardDescription>Last 30 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <AreaChart
            data={historicalRewards}
            margin={{ left: -4, right: 8 }}
          >
            <defs>
                <linearGradient id="colorRewards" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-rewards)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-rewards)" stopOpacity={0.1}/>
                </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <Tooltip
                content={
                    <ChartTooltipContent
                        formatter={(value) => `${(value as number).toFixed(4)} ${REWARD_TOKEN_SYMBOL}`}
                        indicator="dot"
                    />
                }
            />
            <Area
              dataKey="rewards"
              type="monotone"
              fill="url(#colorRewards)"
              stroke="var(--color-rewards)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
