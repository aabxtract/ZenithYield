# Yield Farming dApp — LP Staking & Rewards

A simple Yield Farming smart contract and reference implementation for a frontend where users can stake LP (ERC20) tokens to earn reward tokens over time at a fixed rate.

This project is intended for educational / hackathon use and provides:
- A Solidity staking contract that accepts an LP token and pays reward tokens
- Time-based reward accrual (per-token-per-second rate, high-precision)
- Stake, unstake, claim rewards
- Admin functions to fund the reward pool and set reward rate

---

## ⚙️ Features

- Stake LP tokens (ERC20)
- Earn rewards (ERC20) over time at a configurable rate
- Claim accumulated rewards anytime
- Unstake LP tokens anytime
- Owner can fund rewards and set reward rate
- Safe transfers using OpenZeppelin utilities
- Reentrancy protection

---

## 🧾 Files

- `contracts/LPStaking.sol` — main contract (Solidity)
- (Recommended) `scripts/deploy.js` — deploy & initialization script (not included)
- Frontend (not included): connect with Wagmi/RainbowKit to call `stake`, `unstake`, `claimRewards` and show `earned`, `balanceOf`, `totalSupply`, etc.

---

## 🔧 How It Works (high level)

- Contract tracks per-user staked balances and rewards.
- Reward accrues continuously: a configured `rewardRatePerTokenPerSecond` (scaled by 1e18) defines how many reward tokens a single staked LP token earns per second.
- Rewards are calculated using a standard `rewardPerToken` accumulator pattern to avoid per-block loops.
- User actions (`stake`, `unstake`, `claimRewards`) update global & user reward accounting first (`updateReward`).
- Owner must fund the contract with reward tokens so claims can be paid.

---

## 📐 Important Parameters

- `lpToken` — address of ERC20 LP token users stake.
- `rewardToken` — address of ERC20 token distributed as rewards.
- `rewardRatePerTokenPerSecond` — reward rate per *one LP token* per second, scaled by `1e18` for precision.
  - Example: if you want 0.0000001 reward tokens per staked token per second, set `rewardRatePerTokenPerSecond = 0.0000001 * 1e18`.
  - To compute approximate APR for a given reward token price:  
    `APR ≈ rewardRatePerTokenPerSecond * secondsPerYear * rewardTokenPrice / lpTokenPrice` (approximation)

---

## ▶️ Typical local dev flow (Hardhat)

1. Install:
   ```bash
   npm install
