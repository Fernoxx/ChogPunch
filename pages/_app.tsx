// pages/_app.tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect } from "react"
import { WagmiConfig, createConfig } from "wagmi"
import { base } from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
import { createPublicClient, http } from "viem"

  useEffect(() => {
    ;(async () => {
      try {
        await sdk.actions.ready()
      } catch (e) {
      }
    })()
  }, [])

  const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_ALCHEMY_URL!),
  })

    chains: [base],
    options: {
      name: "Farcaster",
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
  )
}
