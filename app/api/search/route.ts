import { NextResponse } from 'next/server'
import { searchTattooArtistsAndShops } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const { query, filters } = await request.json()
    const { results, error } = await searchTattooArtistsAndShops(query, filters)
    
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }
    
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
  }
}
