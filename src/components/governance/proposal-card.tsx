"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Proposal, VoteType } from '@/hooks/use-governance';
import { useGovernanceContext } from '@/hooks/use-governance-provider';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
    const { vote, votingPower } = useGovernanceContext();
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
    
    const getStatusBadge = (status: Proposal['status']) => {
        switch (status) {
          case 'active':
            return <Badge variant="secondary">Active</Badge>;
          case 'passed':
            return <Badge className="bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30">Passed</Badge>;
          case 'failed':
            return <Badge variant="destructive">Failed</Badge>;
          case 'executed':
              return <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">Executed</Badge>;
          default:
            return <Badge variant="outline">Unknown</Badge>;
        }
      };
  
    return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg">{proposal.title}</CardTitle>
                <CardDescription className="pt-1">
                    Created by {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                </CardDescription>
            </div>
            {getStatusBadge(proposal.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{proposal.description}</p>
        <div className="space-y-2">
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-green-600">For</span>
                    <span>{proposal.votesFor.toLocaleString()}</span>
                </div>
                <Progress value={forPercentage} className="h-2 bg-green-500/20 [&>*]:bg-green-500" />
            </div>
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-red-600">Against</span>
                    <span>{proposal.votesAgainst.toLocaleString()}</span>
                </div>
                <Progress value={againstPercentage} className="h-2 bg-red-500/20 [&>*]:bg-red-500" />
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {proposal.status === 'active' && votingPower > 0 && (
            <>
                <Button variant="outline" size="sm" onClick={() => vote(proposal.id, VoteType.FOR)}>
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600"/> Vote For
                </Button>
                <Button variant="outline" size="sm" onClick={() => vote(proposal.id, VoteType.AGAINST)}>
                    <XCircle className="mr-2 h-4 w-4 text-red-600" /> Vote Against
                </Button>
            </>
        )}
        {proposal.status === 'active' && votingPower === 0 && (
            <p className="text-xs text-muted-foreground">Stake ZEN to vote.</p>
        )}
      </CardFooter>
    </Card>
  );
}
