// utils/walletProviders.ts

export interface WalletProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isRabby?: boolean;
  isOkxWallet?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
}

export function getAvailableWalletProviders(): WalletProvider[] {
  if (typeof window === 'undefined') return [];

  const providers: WalletProvider[] = [];

  try {
    // Check for the main ethereum provider
    if (window.ethereum) {
      // Handle multiple providers (when window.ethereum.providers exists)
      if (Array.isArray((window.ethereum as any).providers)) {
        providers.push(...(window.ethereum as any).providers);
      } else {
        providers.push(window.ethereum as WalletProvider);
      }
    }

    // Check for specific wallet providers that might be available separately
    const walletChecks = [
      { key: 'ethereum', name: 'Generic Ethereum' },
      { key: 'metamask', name: 'MetaMask' },
      { key: 'coinbaseWalletExtension', name: 'Coinbase' },
      { key: 'rabby', name: 'Rabby' },
      { key: 'okxwallet', name: 'OKX' },
    ];

    for (const wallet of walletChecks) {
      const provider = (window as any)[wallet.key];
      if (provider && typeof provider.request === 'function') {
        // Avoid duplicates
        if (!providers.some(p => p === provider)) {
          providers.push(provider);
        }
      }
    }
  } catch (error) {
    console.warn('Error detecting wallet providers:', error);
  }

  return providers;
}

export function getPreferredProvider(): WalletProvider | null {
  const providers = getAvailableWalletProviders();
  
  if (providers.length === 0) return null;
  
  // Priority order: MetaMask > Coinbase > Rabby > OKX > First available
  const preferredOrder = ['isMetaMask', 'isCoinbaseWallet', 'isRabby', 'isOkxWallet'];
  
  for (const preference of preferredOrder) {
    const preferred = providers.find(p => (p as any)[preference]);
    if (preferred) return preferred;
  }
  
  // Return first available if no specific wallet found
  return providers[0];
}

export function logWalletConflicts() {
  if (typeof window === 'undefined') return;

  const providers = getAvailableWalletProviders();
  
  if (providers.length > 1) {
    console.warn(
      `Multiple wallet providers detected (${providers.length}). This may cause conflicts.`,
      'Consider using only one wallet extension at a time.'
    );
  }

  // Log specific wallet types detected
  const detectedWallets = providers.map(p => {
    if ((p as any).isMetaMask) return 'MetaMask';
    if ((p as any).isCoinbaseWallet) return 'Coinbase Wallet';
    if ((p as any).isRabby) return 'Rabby';
    if ((p as any).isOkxWallet) return 'OKX Wallet';
    return 'Unknown Wallet';
  });

  if (detectedWallets.length > 0) {
    console.log('Detected wallets:', detectedWallets.join(', '));
  }
}

// Utility to safely check if we're in a browser environment
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

declare global {
  interface Window {
    ethereum?: any;
  }
}