// pages/simple.tsx
export default function Simple() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1>Simple Test Page</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('Button clicked!')}>
        Test Button
      </button>
    </div>
  )
}