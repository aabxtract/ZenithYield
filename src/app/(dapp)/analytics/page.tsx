import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Protocol Analytics</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChart className="text-primary"/>
                        Historical Performance
                    </CardTitle>
                    <CardDescription>
                        Track the historical performance of the protocol and your investment.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AnalyticsCharts />
                </CardContent>
            </Card>
        </div>
    );
}
