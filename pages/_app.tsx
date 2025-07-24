// pages/_app.tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { injected } from "wagmi/connectors"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

// Simple wagmi config
const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
})

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
