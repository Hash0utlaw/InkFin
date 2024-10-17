import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { searchTattooArtistsAndShops } from '@/lib/openai';
import { Database } from '@/lib/database.types';
import Bottleneck from 'bottleneck';

interface SearchFilters {
  style?: string;
  priceRange?: string;
  type?: 'artist' | 'shop' | 'both';
}

// Create a rate limiter
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000 // Ensures a minimum of 1 second between API calls
});

const rateLimitedSearchTattooArtistsAndShops = limiter.wrap(searchTattooArtistsAndShops);

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { searchTerm, filters, location, page = 1, limit = 10 } = await request.json();

    // Perform database search and AI recommendations in parallel
    const [dbResults, aiResults] = await Promise.all([
      performDatabaseSearch(supabase, searchTerm, filters, location, page, limit),
      rateLimitedSearchTattooArtistsAndShops(searchTerm, filters)
    ]);

    console.log('Supabase results:', dbResults);
    console.log('OpenAI results:', aiResults);

    // Combine results
    const combinedResults = {
      dbResults: dbResults.data,
      aiResults: aiResults.results,
      totalCount: dbResults.count,
      page,
      limit
    };

    const endTime = Date.now();
    console.log(`Search completed in ${endTime - startTime}ms`);

    return NextResponse.json(combinedResults);
  } catch (error) {
    console.error('Error in hybrid search:', error);
    return NextResponse.json({ error: 'An error occurred during search' }, { status: 500 });
  }
}

async function performDatabaseSearch(
  supabase: ReturnType<typeof createRouteHandlerClient<Database>>,
  searchTerm: string,
  filters: SearchFilters,
  location: string,
  page: number,
  limit: number
) {
  try {
    let query = supabase
      .from('business_data')
      .select('*', { count: 'exact' })
      .or(`Name.ilike.%${searchTerm}%,Types.ilike.%${searchTerm}%`)
      .order('Name')
      .range((page - 1) * limit, page * limit - 1);

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

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data || [], count };
  } catch (error) {
    console.error('Error in database search:', error);
    throw error;
  }
}