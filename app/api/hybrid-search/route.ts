// app/api/hybrid-search/route.ts

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { searchTattooArtistsAndShops } from '@/lib/openai';
import { Database } from '@/lib/database.types';

interface SearchFilters {
  style?: string;
  priceRange?: string;
  type?: 'artist' | 'shop' | 'both';
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { searchTerm, filters, location } = await request.json();

  // Database search
  const dbResults = await performDatabaseSearch(supabase, searchTerm, filters, location);
  console.log('Supabase results:', dbResults);

  // AI recommendations
  const aiResults = await searchTattooArtistsAndShops(searchTerm, filters);
  console.log('OpenAI results:', aiResults);

  // Combine results
  const combinedResults = {
    dbResults: dbResults,
    aiResults: aiResults.results
  };

  return NextResponse.json(combinedResults);
}

async function performDatabaseSearch(
  supabase: ReturnType<typeof createRouteHandlerClient<Database>>,
  searchTerm: string,
  filters: SearchFilters,
  location: string
) {
  let query = supabase
    .from('business_data')
    .select('*')
    .or(`Name.ilike.%${searchTerm}%,Types.ilike.%${searchTerm}%`)
    .order('Name');

  if (filters.style) {
    query = query.ilike('Types', `%${filters.style}%`);
  }
  if (filters.priceRange) {
    query = query.ilike('Types', `%${filters.priceRange}%`);
  }
  if (filters.type && filters.type !== 'both') {
    query = query.ilike('Types', `%${filters.type}%`);
  }
  if (location) {
    query = query.ilike('Address', `%${location}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}