export const REWARD_TOKEN_NAME = 'Zenith';
export const REWARD_TOKEN_SYMBOL = 'ZEN';

export interface Pool {
    id: string;
    lpTokenName: string;
    lpTokenSymbol: string;
    rewardTokenName: string;
    rewardTokenSymbol: string;
    apy: number;
    initialTvl: number;
}

export const POOLS: Pool[] = [
    {
        id: 'eth-usdc-lp',
        lpTokenName: 'ETH-USDC LP',
        lpTokenSymbol: 'ETH-USDC',
        rewardTokenName: REWARD_TOKEN_NAME,
        rewardTokenSymbol: REWARD_TOKEN_SYMBOL,
        apy: 0.25,
        initialTvl: 1254321.98,
    },
    {
        id: 'wbtc-eth-lp',
        lpTokenName: 'WBTC-ETH LP',
        lpTokenSymbol: 'WBTC-ETH',
        rewardTokenName: REWARD_TOKEN_NAME,
        rewardTokenSymbol: REWARD_TOKEN_SYMBOL,
        apy: 0.18,
        initialTvl: 876543.21,
    },
    {
        id: 'zen-eth-lp',
        lpTokenName: 'ZEN-ETH LP',
        lpTokenSymbol: 'ZEN-ETH',
        rewardTokenName: REWARD_TOKEN_NAME,
        rewardTokenSymbol: REWARD_TOKEN_SYMBOL,
        apy: 0.35,
        initialTvl: 543210.98,
    }
];
// Deprecated single-pool constants
export const APY = POOLS[0]?.apy ?? 0;
export const TOKEN_NAME = POOLS[0]?.lpTokenName ?? 'LP Token';
export const TOKEN_SYMBOL = POOLS[0]?.lpTokenSymbol ?? 'LP';
export const INITIAL_TVL = POOLS[0]?.initialTvl ?? 0;
