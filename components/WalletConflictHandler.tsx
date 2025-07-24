// components/WalletConflictHandler.tsx
import { useEffect, useState } from 'react';
import { getAvailableWalletProviders, getPreferredProvider } from '../utils/walletProviders';

interface WalletInfo {
  name: string;
  detected: boolean;
  isPreferred: boolean;
}

export default function WalletConflictHandler() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo[]>([]);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkWallets = () => {
      const providers = getAvailableWalletProviders();
      const preferred = getPreferredProvider();
      
      const wallets: WalletInfo[] = [
        {
          name: 'MetaMask',
          detected: providers.some(p => (p as any).isMetaMask),
          isPreferred: preferred && (preferred as any).isMetaMask || false,
        },
        {
          name: 'Coinbase Wallet',
          detected: providers.some(p => (p as any).isCoinbaseWallet),
          isPreferred: preferred && (preferred as any).isCoinbaseWallet || false,
        },
        {
          name: 'Rabby Wallet',
          detected: providers.some(p => (p as any).isRabby),
          isPreferred: preferred && (preferred as any).isRabby || false,
        },
        {
          name: 'OKX Wallet',
          detected: providers.some(p => (p as any).isOkxWallet),
          isPreferred: preferred && (preferred as any).isOkxWallet || false,
        },
      ];

      setWalletInfo(wallets);
      setShowConflictWarning(wallets.filter(w => w.detected).length > 1);
    };

    // Check immediately and then periodically
    checkWallets();
    const interval = setInterval(checkWallets, 5000);

    return () => clearInterval(interval);
  }, [isClient]);

  if (!isClient || walletInfo.length === 0) return null;

  const detectedWallets = walletInfo.filter(w => w.detected);

  return (
    <>
      {showConflictWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '0 0 8px 8px',
          padding: '12px 16px',
          zIndex: 1000,
          fontSize: '14px',
          color: '#856404',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            ⚠️ Multiple Wallet Extensions Detected
          </div>
          <div style={{ marginBottom: '8px' }}>
            Detected: {detectedWallets.map(w => w.name).join(', ')}
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>
            For the best experience, consider disabling all but one wallet extension.
            The app will automatically use the preferred wallet.
          </div>
          <button
            onClick={() => setShowConflictWarning(false)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '12px',
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#856404',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Debug info (only show in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '12px',
          maxWidth: '300px',
          zIndex: 999,
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Wallet Debug Info
          </div>
          {detectedWallets.map(wallet => (
            <div key={wallet.name} style={{ marginBottom: '4px' }}>
              {wallet.isPreferred ? '👑' : '🔗'} {wallet.name}
              {wallet.isPreferred && ' (Preferred)'}
            </div>
          ))}
          {detectedWallets.length === 0 && (
            <div style={{ color: '#ffd700' }}>No wallets detected</div>
          )}
        </div>
      )}
    </>
  );
}