"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Loader2, Zap } from "lucide-react";
import { useYieldZenithContext } from "@/hooks/use-yield-zenith-provider";
import { ZAP_ASSETS } from "@/lib/constants";

export function ZapForm({ poolId }: { poolId: string }) {
    const { zapIn, isZapping } = useYieldZenithContext();
    const [amount, setAmount] = useState("");
    const [asset, setAsset] = useState(ZAP_ASSETS[0].symbol);

    const handleZap = () => {
        const zapAmount = parseFloat(amount);
        if (!isNaN(zapAmount) && zapAmount > 0) {
            zapIn(poolId, asset, zapAmount).then(() => {
                setAmount("");
            });
        }
    }

    const selectedAsset = ZAP_ASSETS.find(a => a.symbol === asset);
    // This is a dummy calculation for demonstration
    const estimatedLp = selectedAsset ? (parseFloat(amount) * selectedAsset.price) / 100 : 0;


    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="zap-amount" className="text-sm font-medium">Input Token</label>
                <div className="flex gap-2">
                    <div className="w-2/3">
                        <Input
                            id="zap-amount"
                            type="number"
                            placeholder="0.0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="w-1/3">
                        <Select value={asset} onValueChange={setAsset}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Asset" />
                            </SelectTrigger>
                            <SelectContent>
                                {ZAP_ASSETS.map(a => (
                                    <SelectItem key={a.symbol} value={a.symbol}>
                                        {a.symbol}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
             {parseFloat(amount) > 0 && (
                 <div className="text-xs text-muted-foreground pt-1">
                    Estimated LP tokens: ~{estimatedLp.toFixed(4)}
                </div>
             )}
            <Button className="w-full" onClick={handleZap} disabled={isZapping(poolId) || !amount || !asset}>
                {isZapping(poolId) ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Zap className="mr-2 h-4 w-4" />
                )}
                {isZapping(poolId) ? "Zapping..." : "Zap In"}
            </Button>
        </div>
    );
}
