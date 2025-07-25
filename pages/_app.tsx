// pages/_app.tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"
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

  const { chains, publicClient } = configureChains(
    [base],
    [publicProvider()]
  )

  const farcasterConnector = new InjectedConnector({
    chains,
    options: {
      name: "Farcaster",
      getProvider: () =>
        typeof window !== "undefined" ? (window as any).farcaster : null,
    },
  })

  const config = createConfig({
    autoConnect: true,
    publicClient,
    connectors: [farcasterConnector],
  })

  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
