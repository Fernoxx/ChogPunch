// lib/contract.ts
export async function submitScore(score: number): Promise<boolean> {
  try {
    console.log(`Submitting score: ${score}`)
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, always return true
    return true
  } catch (error) {
    console.error("Submit score error:", error)
    return false
  }
}