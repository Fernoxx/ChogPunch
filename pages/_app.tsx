// pages/_app.tsx
import "../styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { useEffect } from "react"

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

  return (
    <>
      <Head>
        <title>CHOG GYM - Train & Earn</title>
        <meta name="description" content="CHOG GYM - Train your fighter and earn MON tokens!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
