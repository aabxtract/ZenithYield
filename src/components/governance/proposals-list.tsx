"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGovernanceContext } from '@/hooks/use-governance-provider';
import { ProposalCard } from './proposal-card';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';

export function ProposalsList() {
  const { proposals } = useGovernanceContext();

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Governance Proposals</CardTitle>
            <CardDescription>Vote on proposals to shape the future of the protocol.</CardDescription>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Proposal
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {proposals.length > 0 ? (
          proposals.map(proposal => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No active proposals.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
