"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { historicalTvl } from "@/lib/historical-data"

const chartConfig = {
  tvl: {
    label: "TVL (USD)",
    color: "hsl(var(--primary))",
  },
}

export function TvlChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Total Value Locked (TVL) History</CardTitle>
        <CardDescription>Last 30 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart
            data={historicalTvl}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
                content={
                    <ChartTooltipContent
                        formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value as number)}
                        indicator="line"
                    />
                }
            />
            <Line
              dataKey="tvl"
              type="monotone"
              stroke="var(--color-tvl)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
