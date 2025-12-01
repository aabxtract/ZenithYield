import { subDays, format } from "date-fns";
import { INITIAL_TVL, APY } from "./constants";

const generateDateRange = (days: number) => {
  const endDate = new Date();
  return Array.from({ length: days }, (_, i) => subDays(endDate, days - 1 - i));
};

const DATES = generateDateRange(30);

export const historicalTvl = DATES.map((date, i) => {
  const randomFactor = (Math.sin(i / 5) * 0.05 + Math.random() * 0.02 - 0.01);
  const tvl = INITIAL_TVL * (1 + randomFactor);
  return {
    date: format(date, "yyyy-MM-dd"),
    tvl: Math.round(tvl),
  };
});

export const historicalApy = DATES.map((date, i) => {
    const randomFactor = (Math.cos(i / 7) * 0.02 + (Math.random() - 0.5) * 0.01);
    const apy = APY * 100 * (1 + randomFactor);
    return {
      date: format(date, "yyyy-MM-dd"),
      apy: parseFloat(apy.toFixed(2)),
    };
});

export const historicalRewards = DATES.map((date, i) => {
    const baseReward = 50; // assuming a base daily reward
    const growthFactor = 1 + i * 0.05;
    const randomNoise = (Math.random() - 0.2) * 5;
    const rewards = baseReward * growthFactor + randomNoise;
    return {
      date: format(date, "yyyy-MM-dd"),
      rewards: parseFloat(rewards.toFixed(4)),
    };
});
