// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Load wallet conflict suppressor as early as possible */}
        <script src="/wallet-conflict-suppressor.js" />
        
        {/* Meta tags for better wallet compatibility */}
        <meta name="ethereum-provider" content="multiple-allowed" />
        <meta name="wallet-compatibility" content="multi-provider" />
        
        {/* Favicon fallback to prevent 404 errors */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥊</text></svg>" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}