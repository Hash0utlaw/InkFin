import { NextResponse } from 'next/server';
import { searchTattooArtists } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const searchResult = await searchTattooArtists(query);

    console.log('API route received search result:', searchResult);

    // Ensure we're returning an object with an 'artists' array
    return NextResponse.json({ artists: searchResult.artists || [] });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}