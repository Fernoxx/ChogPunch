// pages/_app.tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWagmiConfig } from "../utils/wagmiConfig"
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

export default function App({ Component, pageProps }: AppProps) {
  const [wagmiConfig, setWagmiConfig] = useState<ReturnType<typeof createWagmiConfig> | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side before initializing wagmi
    setIsClient(true);
    
    // Small delay to let wallet extensions settle
    const timer = setTimeout(() => {
      try {
        const config = createWagmiConfig();
        setWagmiConfig(config);
      } catch (error) {
        console.error('Error creating wagmi config:', error);
        // Create a fallback config
        setWagmiConfig(createWagmiConfig());
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Initialize Farcaster SDK
    const initFarcaster = async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.actions.ready();
      } catch (e) {
        console.error("Farcaster SDK ready error:", e);
      }
    };

    initFarcaster();

    // Add wallet conflict detection
    const detectWalletConflicts = () => {
      if (typeof window === 'undefined') return;

      const errors = [];
      
      // Check for common wallet conflict errors
      window.addEventListener('error', (event) => {
        if (event.message?.includes('Cannot redefine property: ethereum') ||
            event.message?.includes('Cannot set property ethereum') ||
            event.message?.includes('ethereum provider')) {
          errors.push(event.message);
          
          // Prevent the error from propagating
          event.preventDefault();
          event.stopPropagation();
          
          console.warn('Wallet provider conflict detected:', event.message);
          console.info('This is likely due to multiple wallet extensions being installed. The app should still function normally.');
        }
      });

      // Check for unhandled promise rejections related to wallets
      window.addEventListener('unhandledrejection', (event) => {
        if (event.reason?.message?.includes('ethereum') ||
            event.reason?.message?.includes('wallet')) {
          console.warn('Wallet-related promise rejection:', event.reason);
          // Don't prevent default for promise rejections, just log them
        }
      });
    };

    detectWalletConflicts();
  }, [isClient]);

  // Show loading state while wagmi config is being created
  if (!isClient || !wagmiConfig) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    );
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
