"use client"

import { Percent } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

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
import { historicalApy } from "@/lib/historical-data"

const chartConfig = {
  apy: {
    label: "APY (%)",
    color: "hsl(var(--accent))",
  },
}

export function ApyChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Historical APY</CardTitle>
        <CardDescription>Last 30 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={historicalApy}
            margin={{ left: -4 }}>
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
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
                cursor={false}
                content={
                    <ChartTooltipContent
                        formatter={(value) => `${value}%`}
                        indicator="dot"
                    />
                }
            />
            <Bar
              dataKey="apy"
              fill="var(--color-apy)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
