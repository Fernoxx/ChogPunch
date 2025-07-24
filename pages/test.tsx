// pages/test.tsx
import { useAccount } from "wagmi"

export default function Test() {
  const { address, isConnected } = useAccount()
  
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Test Page</h1>
      <p>This is a simple test page.</p>
      <div>
        <strong>Wallet Status:</strong>
        <br />
        Connected: {isConnected ? 'Yes' : 'No'}
        <br />
        Address: {address || 'Not connected'}
      </div>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        If you can see this, the basic wagmi setup is working!
      </div>
    </div>
  )
}