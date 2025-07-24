// utils/contract.ts
import { createPublicClient, http } from "viem"
import { base } from "viem/chains"

const CONTRACT_ADDRESS = "0x76a607429bb5290e6c1ca1fad2e00fa8c2f913df"
const ABI = [
  {
    "inputs": [],
    "name": "signUp",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "signedUsers",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
]

const client = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_URL)
})

export async function checkIfClaimed(address: `0x${string}`) {
  try {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "signedUsers",
      args: [address]
    })
    return result as boolean
  } catch (e) {
    console.error("Error checking claim:", e)
    return false
  }
}

export async function submitScore(address: `0x${string}`, score: number) {
  if (!address || score < 20) return false
  try {
    // For now, we'll use a simplified approach
    // In a real implementation, you would use the connected wallet
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "signedUsers",
      args: [address]
    })
    
    // Simulate successful transaction for demo
    // Replace this with actual wallet transaction
    console.log("Simulating signUp transaction for:", address)
    return true
  } catch (err) {
    console.error("Claim failed:", err)
    return false
  }
}