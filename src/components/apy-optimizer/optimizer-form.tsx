"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getApySuggestion } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Loader2, Sparkles, Terminal } from "lucide-react";
import type { SuggestOptimalApyOutput } from "@/ai/flows/suggest-optimal-apy";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Optimizing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Suggest APY
        </>
      )}
    </Button>
  );
}

export function OptimizerForm() {
  const initialState = { error: {}, data: null as SuggestOptimalApyOutput | null };
  const [state, formAction] = useFormState(getApySuggestion, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="lpTokenAddress">LP Token Address</Label>
          <Input id="lpTokenAddress" name="lpTokenAddress" placeholder="0x..." required />
          {state.error?.lpTokenAddress && <p className="text-destructive text-sm mt-1">{state.error.lpTokenAddress[0]}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tvl">Total Value Locked (USD)</Label>
            <Input id="tvl" name="tvl" type="number" placeholder="1000000" required />
            {state.error?.tvl && <p className="text-destructive text-sm mt-1">{state.error.tvl[0]}</p>}
          </div>
          <div>
            <Label htmlFor="tradingVolume">24h Trading Volume (USD)</Label>
            <Input id="tradingVolume" name="tradingVolume" type="number" placeholder="500000" required />
            {state.error?.tradingVolume && <p className="text-destructive text-sm mt-1">{state.error.tradingVolume[0]}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="componentTokenAddresses">Component Token Addresses</Label>
          <Textarea id="componentTokenAddresses" name="componentTokenAddresses" placeholder="0x..., 0x..., ..." required />
          <p className="text-xs text-muted-foreground mt-1">Comma-separated list of addresses.</p>
          {state.error?.componentTokenAddresses && <p className="text-destructive text-sm mt-1">{state.error.componentTokenAddresses[0]}</p>}
        </div>
        <SubmitButton />
        {state.error?._form && (
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error._form[0]}</AlertDescription>
          </Alert>
        )}
      </form>

      {state.data && (
        <Card className="bg-primary/5 border-primary/20 animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Sparkles />
              Optimal APY Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center bg-background p-6 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Suggested APY</p>
              <p className="text-5xl font-bold tracking-tighter text-primary">
                {(state.data.suggestedApy * 100).toFixed(2)}%
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Reasoning:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{state.data.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
