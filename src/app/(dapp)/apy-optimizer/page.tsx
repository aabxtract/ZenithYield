import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OptimizerForm } from '@/components/apy-optimizer/optimizer-form';
import { Wand2 } from 'lucide-react';

export default function ApyOptimizerPage() {
  return (
    <div className="flex justify-center items-start w-full">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            AI-Powered APY Optimizer
          </CardTitle>
          <CardDescription>
            Get an AI-driven recommendation for the optimal APY for your yield farm based on market data.
            Provide details about your liquidity pool to get a suggestion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OptimizerForm />
        </CardContent>
      </Card>
    </div>
  );
}
