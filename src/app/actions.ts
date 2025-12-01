"use server";

import { suggestOptimalApy, SuggestOptimalApyInput } from "@/ai/flows/suggest-optimal-apy";
import { z } from "zod";

const SuggestApySchema = z.object({
  lpTokenAddress: z.string().startsWith("0x", { message: "Must be a valid address" }).length(42, { message: "Address must be 42 characters long" }),
  tvl: z.coerce.number().positive({ message: "TVL must be a positive number" }),
  tradingVolume: z.coerce.number().positive({ message: "Volume must be a positive number" }),
  componentTokenAddresses: z.string().min(1, { message: "At least one component address is required" }),
});

export async function getApySuggestion(formData: FormData) {
  const rawData = {
    lpTokenAddress: formData.get("lpTokenAddress"),
    tvl: formData.get("tvl"),
    tradingVolume: formData.get("tradingVolume"),
    componentTokenAddresses: formData.get("componentTokenAddresses"),
  };

  const validation = SuggestApySchema.safeParse(rawData);

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  const input: SuggestOptimalApyInput = {
    ...validation.data,
    componentTokenAddresses: validation.data.componentTokenAddresses.split(',').map(addr => addr.trim()),
  };

  try {
    const result = await suggestOptimalApy(input);
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: { _form: ["An unexpected error occurred."] } };
  }
}
