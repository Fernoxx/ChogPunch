import "../styles/globals.css"
import { WagmiConfig, createConfig } from "wagmi"
import { base } from "wagmi/chains"
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"
import { createPublicClient, http } from "viem"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_URL!),
})

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: farcasterMiniApp({
    enableFarcaster: true,
    enableCoinbase: true,
    enableInjected: false,
    enableWalletConnect: false,
    enableRainbow: false
  }),
})

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: any) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiConfig>
  )
}
