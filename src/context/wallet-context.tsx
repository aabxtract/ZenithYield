"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const DUMMY_ADDRESS = '0x1A2b3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T';

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = () => {
    setIsConnected(true);
    setAddress(DUMMY_ADDRESS);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
  };

  return (
    <WalletContext.Provider value={{ isConnected, address, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
