"use client";

import { WalletProvider } from '@/context/wallet-context';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
