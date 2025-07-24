import { writeContract, readContract } from 'wagmi/actions'
import { base } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { createConfig, http } from 'wagmi'
import ABI from '@/lib/chogABI.json'

const CONTRACT_ADDRESS = '0x76a607429bb5290e6c1ca1fad2e00fa8c2f913df' as `0x${string}`

const config = getDefaultConfig({
  appName: 'ChogPunch',
  projectId: 'your-project-id',
  chains: [base],
  transports: {
    [base.id]: http(),
  },
})

export async function submitScore(address: string, score: number): Promise<boolean> {
  try {
    const tx = await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'signUp',
      args: [],
      chainId: base.id,
    })
    console.log('Transaction submitted:', tx)
    return true
  } catch (error) {
    console.error('Error submitting score:', error)
    return false
  }
}

export async function checkIfClaimed(address: string): Promise<boolean> {
  try {
    const result = await readContract(config, {
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'hasSignedUp',
      args: [address],
      chainId: base.id,
    })
    return result as boolean
  } catch (error) {
    console.error('Error checking claim status:', error)
    return false
  }
}