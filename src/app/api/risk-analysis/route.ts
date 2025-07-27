import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { portfolio } = await request.json()

    if (!portfolio || !Array.isArray(portfolio)) {
      return NextResponse.json({ error: 'Invalid portfolio data' }, { status: 400 })
    }

    const prompt = `
Analyze the following crypto portfolio and return **only** valid JSON:
{
  "scores": {
    "volatility": <1-10>,
    "centralization": <1-10>,
    "marketCap": <1-10>,
    "maturity": <1-10>,
    "diversification": <1-10>
  },
  "summary": "<1-2 sentences>"
}

Portfolio: ${JSON.stringify(portfolio)}
`

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Gemini kadang bungkus dengan ```json … ```
    const cleaned = text.replace(/```(?:json)?/g, '').trim()
    const analysis = JSON.parse(cleaned)

    return NextResponse.json(analysis)
  } catch (err) {
    console.error('Gemini risk-analysis error:', err)
    // fallback jika parsing gagal
    return NextResponse.json({
      scores: { volatility: 5, centralization: 5, marketCap: 5, maturity: 5, diversification: 5 },
      summary: 'Unable to analyze portfolio—showing neutral scores.',
    })
  }
}