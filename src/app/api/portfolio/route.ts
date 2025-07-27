import { NextRequest, NextResponse } from 'next/server'

interface CovalentToken {
  contract_ticker_symbol: string;
  balance: string;
  quote: number;
  contract_address: string;
  contract_decimals: number;
  logo_url?: string;
}

// Hard-code Covalent base URL (safe – no secret here)
const COVALENT_BASE_URL = 'https://api.covalenthq.com/v1'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const address = searchParams.get('address')
    const chainId = searchParams.get('chainId') || '56' // BNB Chain

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    const response = await fetch(
      `${COVALENT_BASE_URL}/${chainId}/address/${address}/balances_v2/` +
        `?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=${process.env.COVALENT_API_KEY!}`,
      { cache: 'no-store' } // optional: always fresh data
    )

    if (!response.ok) {
      throw new Error(`Covalent API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.data?.items) {
      return NextResponse.json({ tokens: [] })
    }

const tokens: CovalentToken[] = data.data.items
  .filter((t: CovalentToken) => parseFloat(t.balance) > 0 && t.quote > 0.01)
  .map((t: CovalentToken) => ({
    symbol: t.contract_ticker_symbol,
    balance: t.balance,
    value: t.quote,
    contractAddress: t.contract_address,
    decimals: t.contract_decimals,
    logo: t.logo_url ?? '',
  }));

    return NextResponse.json({ tokens })
  } catch (err) {
    console.error('Portfolio fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}