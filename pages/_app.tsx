
import "../styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect } from "react"
import { WagmiConfig, createConfig } from "wagmi"
import { base } from "wagmi/chains"

  useEffect(() => {
    ;(async () => {
      try {
        await sdk.actions.ready()
      } catch (e) 
  })

  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
  )
}
