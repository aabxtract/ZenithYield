'use server';

/**
 * @fileOverview A flow to suggest an optimal APY for a yield farm.
 *
 * - suggestOptimalApy - A function that suggests an optimal APY based on market data.
 * - SuggestOptimalApyInput - The input type for the suggestOptimalApy function.
 * - SuggestOptimalApyOutput - The return type for the suggestOptimalApy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalApyInputSchema = z.object({
  lpTokenAddress: z
    .string()
    .describe('The address of the LP token for the yield farm.'),
  tvl: z.number().describe('The total value locked in the yield farm in USD.'),
  tradingVolume: z
    .number()
    .describe('The 24-hour trading volume of the LP token in USD.'),
  componentTokenAddresses: z
    .array(z.string())
    .describe('The addresses of the component tokens in the LP token.'),
});
export type SuggestOptimalApyInput = z.infer<typeof SuggestOptimalApyInputSchema>;

const SuggestOptimalApyOutputSchema = z.object({
  suggestedApy: z
    .number()
    .describe(
      'The suggested APY (Annual Percentage Yield) for the yield farm, as a percentage (e.g., 0.25 for 25%).'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested APY, including factors considered and calculations made.'
    ),
});
export type SuggestOptimalApyOutput = z.infer<typeof SuggestOptimalApyOutputSchema>;

export async function suggestOptimalApy(input: SuggestOptimalApyInput): Promise<SuggestOptimalApyOutput> {
  return suggestOptimalApyFlow(input);
}

const getLpTokenPrice = ai.defineTool({
  name: 'getLpTokenPrice',
  description: 'Returns the current market price of an LP token and its component tokens.',
  inputSchema: z.object({
    lpTokenAddress: z.string().describe('The address of the LP token.'),
    componentTokenAddresses: z
      .array(z.string())
      .describe('The addresses of the component tokens in the LP token.'),
  }),
  outputSchema: z.object({
    lpTokenPrice: z.number().describe('The current price of the LP token in USD.'),
    componentTokenPrices: z
      .array(z.number())
      .describe('The current prices of the component tokens in USD.'),
  }),
  async function(input) {
    // TODO: Implement the logic to fetch the LP token price and component token prices from a reliable source.
    // This is a placeholder implementation.
    return {
      lpTokenPrice: 100, // Replace with actual LP token price
      componentTokenPrices: input.componentTokenAddresses.map(() => 10), // Replace with actual component token prices
    };
  },
});

const getDexData = ai.defineTool({
  name: 'getDexData',
  description: 'Returns the trading volume of an LP token on a specific DEX.',
  inputSchema: z.object({
    lpTokenAddress: z.string().describe('The address of the LP token.'),
  }),
  outputSchema: z.object({
    tradingVolume: z
      .number()
      .describe('The 24-hour trading volume of the LP token on this DEX in USD.'),
  }),
  async function(input) {
    // TODO: Implement the logic to fetch the trading volume of the LP token from a DEX.
    // This is a placeholder implementation.
    return {
      tradingVolume: 1000000, // Replace with actual trading volume
    };
  },
});

const prompt = ai.definePrompt({
  name: 'suggestOptimalApyPrompt',
  tools: [getLpTokenPrice, getDexData],
  input: {schema: SuggestOptimalApyInputSchema},
  output: {schema: SuggestOptimalApyOutputSchema},
  prompt: `You are an expert in DeFi yield farming and tokenomics. Your goal is to suggest an optimal APY (Annual Percentage Yield) for a yield farm, considering the following factors:

- **LP Token Performance:** Use the getLpTokenPrice tool to get the current market price of the LP token (address: {{{lpTokenAddress}}}) and its component tokens (addresses: {{{componentTokenAddresses}}}). Analyze the price trends and volatility.
- **TVL (Total Value Locked):** The current TVL in the yield farm is ${{{tvl}}} USD. A higher TVL indicates more user confidence and participation.
- **Trading Volume:** Use the getDexData tool to get the 24-hour trading volume of the LP token (address: {{{lpTokenAddress}}}). A higher trading volume indicates more liquidity and demand.
- **Market Conditions:** Consider the overall market conditions and sentiment in the DeFi space.
- **Competitor APYs:** Research the APYs offered by similar yield farms.

Based on these factors, provide a suggested APY that balances attracting users and maintaining a healthy pool. Provide a clear reasoning for your suggestion, including the factors you considered and any calculations you made. Return the suggested APY as a decimal (e.g., 0.25 for 25%).
`,
});

const suggestOptimalApyFlow = ai.defineFlow(
  {
    name: 'suggestOptimalApyFlow',
    inputSchema: SuggestOptimalApyInputSchema,
    outputSchema: SuggestOptimalApyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
