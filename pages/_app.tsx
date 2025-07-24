// pages/_app.tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import WalletConflictHandler from "../components/WalletConflictHandler"
import WalletErrorBoundary from "../components/ErrorBoundary"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on wallet connection errors
        if (error?.message?.includes('User rejected') || 
            error?.message?.includes('User denied')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// Create wagmi config outside component to avoid recreation
const createWagmiConfig = () => {
  const connectors = [
    injected(),
    metaMask(),
    coinbaseWallet({
      appName: "ChogPunch MiniApp",
    }),
  ];

  return createConfig({
    chains: [base],
    connectors,
    transports: {
      [base.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_URL || 'https://mainnet.base.org'),
    },
  });
};

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  const [wagmiConfig] = useState(() => createWagmiConfig());

  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true);

    // Initialize Farcaster SDK
    const initFarcaster = async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.actions.ready();
        console.log('Farcaster SDK initialized');
      } catch (e) {
        console.warn("Farcaster SDK ready error:", e);
      }
    };

    initFarcaster();

    // Add wallet conflict detection
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Cannot redefine property: ethereum') ||
          event.message?.includes('Cannot set property ethereum') ||
          event.message?.includes('ethereum provider')) {
        event.preventDefault();
        event.stopPropagation();
        console.info('ℹ️ Wallet provider conflict detected - this is normal when multiple wallet extensions are installed');
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('ethereum') ||
          event.reason?.message?.includes('wallet')) {
        console.info('ℹ️ Wallet-related promise rejection handled');
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <WalletErrorBoundary>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <WalletConflictHandler />
          <Component {...pageProps} />
        </QueryClientProvider>
      </WagmiProvider>
    </WalletErrorBoundary>
  );
}
