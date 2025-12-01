export const REWARD_TOKEN_NAME = 'Zenith';
export const REWARD_TOKEN_SYMBOL = 'ZEN';
export const ADMIN_ADDRESS = '0x1A2b3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T';

export interface Pool {
    id: string;
    lpTokenName: string;
    lpTokenSymbol: string;
    rewardTokenName: string;
    rewardTokenSymbol: string;
    apy: number;
    initialTvl: number;
    totalRewards: number;
    active: boolean;
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
        totalRewards: 100000,
        active: true,
    },
    {
        id: 'wbtc-eth-lp',
        lpTokenName: 'WBTC-ETH LP',
        lpTokenSymbol: 'WBTC-ETH',
        rewardTokenName: REWARD_TOKEN_NAME,
        rewardTokenSymbol: REWARD_TOKEN_SYMBOL,
        apy: 0.18,
        initialTvl: 876543.21,
        totalRewards: 50000,
        active: true,
    },
    {
        id: 'zen-eth-lp',
        lpTokenName: 'ZEN-ETH LP',
        lpTokenSymbol: 'ZEN-ETH',
        rewardTokenName: REWARD_TOKEN_NAME,
        rewardTokenSymbol: REWARD_TOKEN_SYMBOL,
        apy: 0.35,
        initialTvl: 543210.98,
        totalRewards: 200000,
        active: false,
    }
];

export const ZAP_ASSETS = [
    { symbol: 'ETH', name: 'Ethereum', price: 3500 },
    { symbol: 'USDC', name: 'USD Coin', price: 1 },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', price: 65000 },
];

// Deprecated single-pool constants
export const APY = POOLS[0]?.apy ?? 0;
export const TOKEN_NAME = POOLS[0]?.lpTokenName ?? 'LP Token';
export const TOKEN_SYMBOL = POOLS[0]?.lpTokenSymbol ?? 'LP';
export const INITIAL_TVL = POOLS[0]?.initialTvl ?? 0;
