// pages/_app.tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { WagmiConfig, createConfig } from "wagmi"
import { base } from "wagmi/chains"

    chain: base,
  })

    chains: [base],
    },

  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
