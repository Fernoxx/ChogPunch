// pages/_app.tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { WagmiConfig, createConfig } from "wagmi"
import { base } from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
import { createPublicClient, http } from "viem"

export default function App({ Component, pageProps }: AppProps) {
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
  })

  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
