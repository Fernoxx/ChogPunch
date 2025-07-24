import { createPublicClient, http } from 'viem'
import { base } from 'wagmi/chains'

export const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPC || 'https://mainnet.base.org')
})