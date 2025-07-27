import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, bsc } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

export const config = getDefaultConfig({
  appName: 'AI Crypto Portfolio Advisor',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, polygon, arbitrum, optimism, bsc],
  ssr: true,
})

export const COVALENT_BASE_URL = 'https://api.covalenthq.com/v1'