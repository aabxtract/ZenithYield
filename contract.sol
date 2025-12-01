
---

# Solidity Smart Contract — `contracts/LPStaking.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/*
  LPStaking.sol

  Simple LP staking contract:
  - Stake an ERC20 LP token
  - Earn reward tokens (ERC20) at a fixed per-token-per-second rate
  - Claim rewards, unstake LP
  - Owner functions to set rate and recover tokens
*/

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LPStaking is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    /// @notice ERC20 token staked by users (LP token)
    IERC20 public immutable lpToken;

    /// @notice ERC20 token used for rewards
    IERC20 public immutable rewardToken;

    /// @notice reward rate per 1 LP token per second, scaled by 1e18 for precision
    /// rewardPerTokenIncrement = rewardRatePerTokenPerSecond * timeElapsed
    uint256 public rewardRatePerTokenPerSecond; // scaled by 1e18

    uint256 private constant PRECISION = 1e18;

    /// @notice global reward-per-token accumulator (scaled by 1e18)
    uint256 public rewardPerTokenStored;

    /// @notice last timestamp rewardPerTokenStored was updated
    uint256 public lastUpdateTime;

    /// @notice total LP tokens staked
    uint256 public totalSupply;

    /// @notice user balances of staked LP
    mapping(address => uint256) public balanceOf;

    /// @notice user -> rewards already accumulated (to be claimed)
    mapping(address => uint256) public rewards;

    /// @notice user -> user-specific rewardPerToken at last update
    mapping(address => uint256) public userRewardPerTokenPaid;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);
    event RewardsFunded(uint256 amount);
    event RecoveredERC20(address token, uint256 amount);

    constructor(address _lpToken, address _rewardToken, uint256 _rewardRatePerTokenPerSecond) {
        require(_lpToken != address(0) && _rewardToken != address(0), "Zero address");
        lpToken = IERC20(_lpToken);
        rewardToken = IERC20(_rewardToken);
        rewardRatePerTokenPerSecond = _rewardRatePerTokenPerSecond;
        lastUpdateTime = block.timestamp;
    }

    /* ========== Views ========== */

    /// @notice returns current rewardPerToken taking into account elapsed time
    function rewardPerToken() public view returns (uint256) {
        uint256 timeDelta = block.timestamp - lastUpdateTime;
        // reward increment scaled by PRECISION
        uint256 increment = rewardRatePerTokenPerSecond * timeDelta;
        // rewardPerTokenStored and increment are both scaled by 1e18
        return rewardPerTokenStored + increment;
    }

    /// @notice calculates earned rewards for an account (including stored rewards)
    function earned(address account) public view returns (uint256) {
        uint256 rpt = rewardPerToken();
        uint256 paid = userRewardPerTokenPaid[account];
        // (balance * (rpt - paid)) / PRECISION + rewards[account]
        uint256 pending = (balanceOf[account] * (rpt - paid)) / PRECISION;
        return rewards[account] + pending;
    }

    /* ========== Mutative functions ========== */

    /// @dev update global and user reward accounting
    modifier updateReward(address account) {
        // update global accumulator
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            // update user's earned and snapshot
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    /// @notice Stake LP tokens
    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        // Transfer LP tokens from user to contract
        lpToken.safeTransferFrom(msg.sender, address(this), amount);

        balanceOf[msg.sender] += amount;
        totalSupply += amount;

        emit Staked(msg.sender, amount);
    }

    /// @notice Unstake LP tokens
    function unstake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot unstake 0");
        require(balanceOf[msg.sender] >= amount, "Insufficient staked");

        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;

        // Transfer LP tokens back to user
        lpToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    /// @notice Claim accumulated reward tokens
    function claimRewards() external nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards");

        rewards[msg.sender] = 0;

        // Transfer reward tokens to user
        rewardToken.safeTransfer(msg.sender, reward);

        emit RewardPaid(msg.sender, reward);
    }

    /* ========== Owner (admin) functions ========== */

    /// @notice Owner can set reward rate per token per second (scaled by 1e18)
    function setRewardRatePerTokenPerSecond(uint256 newRate) external onlyOwner updateReward(address(0)) {
        uint256 old = rewardRatePerTokenPerSecond;
        rewardRatePerTokenPerSecond = newRate;
        emit RewardRateUpdated(old, newRate);
    }

    /// @notice Owner/funder funds reward pool by sending reward tokens to this contract
    /// Use token.transfer(stakingAddress, amount) off-chain or call this after transferring tokens.
    function notifyFunded(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount 0");
        // No on-chain accounting needed — rewards are pulled from contract balance on claim
        emit RewardsFunded(amount);
    }

    /// @notice Emergency recover ERC20 (owner only). Use carefully.
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner {
        IERC20(tokenAddress).safeTransfer(owner(), tokenAmount);
        emit RecoveredERC20(tokenAddress, tokenAmount);
    }

    /* ========== Helpers ========== */

    /// @notice Return user's staked balance
    function getUserStake(address user) external view returns (uint256) {
        return balanceOf[user];
    }

    /// @notice Return the contract's reward token balance (useful for frontend)
    function rewardTokenBalance() external view returns (uint256) {
        return rewardToken.balanceOf(address(this));
    }
}
