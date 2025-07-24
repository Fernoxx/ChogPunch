# Wallet Provider Conflicts - Troubleshooting Guide

## The Problem

When multiple wallet browser extensions are installed (MetaMask, Pocket Universe, Backpack, Coinbase Wallet, etc.), they can conflict with each other by trying to inject their own `window.ethereum` provider. This results in console errors like:

```
Uncaught TypeError: Cannot redefine property: ethereum
MetaMask encountered an error setting the global Ethereum provider
Backpack couldn't override `window.ethereum`
```

## How We Handle It

Our ChogPunch MiniApp includes comprehensive wallet conflict handling:

### 1. **Error Suppression Script** (`public/wallet-conflict-suppressor.js`)
- Loaded early in the page lifecycle
- Intercepts and suppresses wallet conflict errors
- Converts scary error messages into friendly info messages
- Prevents error spam in the console

### 2. **Smart Wallet Detection** (`utils/walletProviders.ts`)
- Detects all available wallet providers
- Handles multiple provider scenarios
- Automatically selects the preferred wallet
- Priority order: MetaMask → Coinbase → Rabby → OKX → First Available

### 3. **Robust Wagmi Configuration** (`utils/wagmiConfig.ts`)
- Multiple connector types for better compatibility
- Specific wallet connectors with fallbacks
- Disabled auto-discovery to prevent conflicts

### 4. **User Interface Components**
- **WalletConflictHandler**: Shows warnings when multiple wallets detected
- **WalletErrorBoundary**: Catches and handles wallet-related React errors
- Debug info panel (development only)

### 5. **Graceful Error Handling**
- Error boundaries prevent app crashes
- Automatic error recovery
- User-friendly conflict notifications

## For Users

### Recommended Solution
**Use only one wallet extension at a time** for the best experience:

1. **Option A**: Disable extra wallet extensions
   - Go to your browser's extension settings
   - Disable all wallet extensions except your preferred one

2. **Option B**: Use browser profiles
   - Create separate browser profiles for different wallets
   - Use each profile with only one wallet extension

### Supported Wallets
- ✅ MetaMask
- ✅ Coinbase Wallet  
- ✅ Rabby Wallet
- ✅ OKX Wallet
- ✅ Any injected wallet provider

### What to Expect
- **Multiple wallets detected**: Yellow warning banner at the top
- **App still works**: Despite console errors, functionality remains intact
- **Automatic selection**: The app will choose the best available wallet
- **Clean console**: Most conflict errors are suppressed

## For Developers

### Key Features Implemented

1. **Early Error Interception**
   ```javascript
   // Loaded before any wallet injection
   <script src="/wallet-conflict-suppressor.js" />
   ```

2. **Provider Detection**
   ```typescript
   const providers = getAvailableWalletProviders();
   const preferred = getPreferredProvider();
   ```

3. **Error Boundaries**
   ```tsx
   <WalletErrorBoundary>
     <WagmiProvider config={wagmiConfig}>
       // App content
     </WagmiProvider>
   </WalletErrorBoundary>
   ```

4. **Delayed Initialization**
   ```typescript
   // Let wallet extensions settle before initializing
   setTimeout(() => {
     const config = createWagmiConfig();
     setWagmiConfig(config);
   }, 100);
   ```

### Testing

The app handles these conflict scenarios:
- ✅ Single wallet extension
- ✅ Multiple wallet extensions
- ✅ No wallet extensions
- ✅ Disabled wallet extensions
- ✅ Wallet extension conflicts
- ✅ Provider injection race conditions

### Console Output

Instead of scary errors, users see:
```
🛡️ Wallet conflict suppressor loaded
ℹ️ Multiple wallet extensions detected
ℹ️ Detected wallets: MetaMask, Pocket Universe, Backpack
ℹ️ Using preferred wallet: MetaMask
```

## Technical Details

### Provider Conflict Resolution
1. **Detection**: Scan `window.ethereum` and known wallet objects
2. **Prioritization**: Use predefined preference order
3. **Fallback**: Default to first available provider
4. **Error Handling**: Suppress conflicts, log helpful messages

### Performance Impact
- **Minimal**: ~1KB additional JavaScript
- **Fast**: Early script loading prevents conflicts
- **Efficient**: Only active when conflicts detected

## Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox  
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (where applicable)

---

**Result**: Users get a smooth experience regardless of their wallet setup, and developers don't need to worry about provider conflicts breaking the app.