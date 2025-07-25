// pages/_app.tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { useEffect } from "react"
import { WagmiConfig, createConfig, configureChains } from "wagmi"
import { base } from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
import { publicProvider } from "wagmi/providers/public"

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    ;(async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk")
        await sdk.actions.ready()
      } catch (e) {
        console.error("Farcaster SDK ready error:", e)
      }
    })()
  }, [])

  // Filter out wallet extension noise in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const originalError = console.error
      const originalWarn = console.warn
      
      console.error = (...args) => {
        if (
          typeof args[0] === "string" && 
          (args[0].includes("Cannot redefine property: ethereum") ||
           args[0].includes("MetaMask encountered an error") ||
           args[0].includes("Pocket Universe") ||
           args[0].includes("Backpack couldn't override"))
        ) {
          return // Suppress these wallet extension conflicts
        }
        originalError.apply(console, args)
      }
      
      console.warn = (...args) => {
        if (
          typeof args[0] === "string" && 
          (args[0].includes("ethereum") && args[0].includes("override"))
        ) {
          return // Suppress these wallet extension warnings
        }
        originalWarn.apply(console, args)
      }
      
      return () => {
        console.error = originalError
        console.warn = originalWarn
      }
    }
  }, [])

  const { chains, publicClient } = configureChains(
    [base],
    [publicProvider()]
  )

  // Helper function to safely get Farcaster provider
  const getFarcasterProvider = () => {
    if (typeof window === "undefined") return null
    
    try {
      // First check for Farcaster-specific provider
      if ((window as any).farcaster) {
        return (window as any).farcaster
      }
      
      // Fallback to ethereum provider if available
      if ((window as any).ethereum) {
        return (window as any).ethereum
      }
      
      return null
    } catch (error) {
      console.warn("Error accessing wallet provider:", error)
      return null
    }
  }

  const farcasterConnector = new InjectedConnector({
    chains,
    options: {
      name: "Farcaster",
      getProvider: getFarcasterProvider,
    },
  })

  const config = createConfig({
    autoConnect: true,
    publicClient,
    connectors: [farcasterConnector],
  })

  return (
    <>
      <Head>
        <title>CHOG GYM</title>
        <meta name="description" content="CHOG GYM - Train with Chog!" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥊</text></svg>" />
      </Head>
      <WagmiConfig config={config}>
        <Component {...pageProps} />
      </WagmiConfig>
    </>
  )
}
