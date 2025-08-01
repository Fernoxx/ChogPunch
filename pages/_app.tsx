// pages/_app.tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect } from "react"
import { WagmiConfig, createConfig } from "wagmi"
import { base } from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
    
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
