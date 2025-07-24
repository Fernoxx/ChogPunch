// utils/wagmiConfig.ts
import { createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors"
import { logWalletConflicts, isBrowser } from "./walletProviders"

export function createWagmiConfig() {
  // Log wallet conflicts for debugging
  if (isBrowser()) {
    logWalletConflicts();
  }

  // Configure multiple connectors for better wallet support
  const connectors = [
    // Injected connector (fallback for any injected wallet)
    injected({
      target: () => ({
        id: 'injected',
        name: 'Injected Wallet',
        provider: typeof window !== 'undefined' ? window.ethereum : undefined,
      }),
    }),
    
    // Specific wallet connectors
    metaMask({
      dappMetadata: {
        name: "ChogPunch MiniApp",
        url: typeof window !== 'undefined' ? window.location.origin : '',
      },
    }),
    
    coinbaseWallet({
      appName: "ChogPunch MiniApp",
      appLogoUrl: typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '',
    }),
  ];

  const config = createConfig({
    chains: [base],
    connectors,
    transports: {
      [base.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_URL),
    },
    // Add some additional config for better error handling
    multiInjectedProviderDiscovery: false, // Disable auto-discovery to avoid conflicts
  });

  return config;
}