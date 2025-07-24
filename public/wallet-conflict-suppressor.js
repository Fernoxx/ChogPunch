// public/wallet-conflict-suppressor.js
(function() {
  'use strict';
  
  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Wallet conflict error patterns to suppress
  const suppressPatterns = [
    /Cannot redefine property: ethereum/,
    /Cannot set property ethereum/,
    /ethereum provider.*conflict/i,
    /Multiple wallet providers/i,
    /window\.ethereum.*override/i,
    /Pocket Universe.*window\.ethereum/,
    /MetaMask.*setting the global Ethereum provider/,
    /Backpack.*override.*window\.ethereum/,
  ];
  
  function shouldSuppress(message) {
    if (typeof message !== 'string') return false;
    return suppressPatterns.some(pattern => pattern.test(message));
  }
  
  // Override console.error
  console.error = function(...args) {
    const firstArg = args[0];
    if (shouldSuppress(firstArg)) {
      // Instead of showing an error, show a more user-friendly info message
      console.info('ℹ️ Wallet provider conflict detected - this is normal when multiple wallet extensions are installed');
      return;
    }
    originalError.apply(console, args);
  };
  
  // Override console.warn for some wallet warnings
  console.warn = function(...args) {
    const firstArg = args[0];
    if (shouldSuppress(firstArg)) {
      console.info('ℹ️ Multiple wallet extensions detected');
      return;
    }
    originalWarn.apply(console, args);
  };
  
  // Suppress uncaught errors related to wallet conflicts
  window.addEventListener('error', function(event) {
    if (shouldSuppress(event.message)) {
      event.preventDefault();
      event.stopPropagation();
      console.info('ℹ️ Wallet provider conflict suppressed - app should continue normally');
    }
  });
  
  // Suppress unhandled promise rejections related to wallets
  window.addEventListener('unhandledrejection', function(event) {
    const message = event.reason?.message || event.reason;
    if (shouldSuppress(message)) {
      event.preventDefault();
      console.info('ℹ️ Wallet-related promise rejection suppressed');
    }
  });
  
  console.info('🛡️ Wallet conflict suppressor loaded');
})();