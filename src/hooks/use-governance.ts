"use client";

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/context/wallet-context';
import { useToast } from './use-toast';

export enum VoteType {
    FOR,
    AGAINST,
}

export type Proposal = {
    id: number;
    proposer: string;
    title: string;
    description: string;
    status: 'active' | 'passed' | 'failed' | 'executed';
    votesFor: number;
    votesAgainst: number;
};

const DUMMY_PROPOSALS: Proposal[] = [
    {
        id: 1,
        proposer: '0x1A2b3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T',
        title: 'Increase Reward Rate by 10%',
        description: 'This proposal aims to increase the reward rate for the main LP staking pool by 10% to attract more liquidity providers.',
        status: 'active',
        votesFor: 125000,
        votesAgainst: 23000,
    },
    {
        id: 2,
        proposer: '0xabc...def',
        title: 'Integrate a New Stablecoin Pool',
        description: 'Create a new staking pool for a DAI/USDC LP token to diversify the platform\'s offerings.',
        status: 'passed',
        votesFor: 500000,
        votesAgainst: 10000,
    },
    {
        id: 3,
        proposer: '0x123...456',
        title: 'Allocate Treasury Funds for Marketing',
        description: 'Allocate 5% of the treasury funds for a marketing campaign to increase awareness of YieldZenith.',
        status: 'failed',
        votesFor: 80000,
        votesAgainst: 150000,
    }
];

export const useGovernance = () => {
    const { isConnected, address } = useWallet();
    const { toast } = useToast();

    // ZEN token state
    const [zenBalance, setZenBalance] = useState(5000); // Dummy balance
    const [stakedZen, setStakedZen] = useState(0);

    // Voting power state (veZEN)
    const [votingPower, setVotingPower] = useState(0);
    
    // Proposal state
    const [proposals, setProposals] = useState<Proposal[]>(DUMMY_PROPOSALS);
    const [proposalCount, setProposalCount] = useState(DUMMY_PROPOSALS.length);

    // Loading states
    const [isStaking, setIsStaking] = useState(false);
    const [isUnstaking, setIsUnstaking] = useState(false);

    useEffect(() => {
        if (!isConnected) {
            setStakedZen(0);
            setVotingPower(0);
        }
    }, [isConnected]);

    // Staked ZEN determines voting power 1:1 in this simple model
    useEffect(() => {
        setVotingPower(stakedZen);
    }, [stakedZen]);

    const totalZenStaked = proposals.reduce((acc, p) => acc + p.votesFor + p.votesAgainst, stakedZen);

    const stakeZen = useCallback(async (amount: number) => {
        if (amount <= 0 || amount > zenBalance) {
          toast({ variant: "destructive", title: "Invalid Amount" });
          return;
        }
        setIsStaking(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setZenBalance(prev => prev - amount);
        setStakedZen(prev => prev + amount);
        setIsStaking(false);
        toast({ title: "Staked Successfully", description: `You have staked ${amount} ZEN.` });
    }, [zenBalance, toast]);

    const unstakeZen = useCallback(async (amount: number) => {
        if (amount <= 0 || amount > stakedZen) {
          toast({ variant: "destructive", title: "Invalid Amount" });
          return;
        }
        setIsUnstaking(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStakedZen(prev => prev - amount);
        setZenBalance(prev => prev + amount);
        setIsUnstaking(false);
        toast({ title: "Unstaked Successfully", description: `You have unstaked ${amount} ZEN.` });
    }, [stakedZen, toast]);

    const vote = useCallback(async (proposalId: number, voteType: VoteType) => {
        if (votingPower <= 0) {
            toast({ variant: "destructive", title: "No Voting Power", description: "You must stake ZEN to vote." });
            return;
        }

        toast({ title: "Submitting Vote...", description: `Casting your vote for proposal #${proposalId}.` });
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setProposals(prevProposals => 
            prevProposals.map(p => {
                if (p.id === proposalId) {
                    if (voteType === VoteType.FOR) {
                        return { ...p, votesFor: p.votesFor + votingPower };
                    } else {
                        return { ...p, votesAgainst: p.votesAgainst + votingPower };
                    }
                }
                return p;
            })
        );
        
        // In a real scenario, you'd probably lock the user's voting power until the proposal ends.
        // For this mock, we'll just show a success message.
        toast({ title: "Vote Cast!", description: `Your ${votingPower.toLocaleString()} votes have been recorded.` });

    }, [votingPower, toast]);

    return {
        zenBalance,
        stakedZen,
        totalZenStaked,
        votingPower,
        proposals,
        proposalCount,
        isStaking,
        isUnstaking,
        stakeZen,
        unstakeZen,
        vote,
    };
};
