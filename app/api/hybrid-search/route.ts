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

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000
});

const rateLimitedSearchTattooArtistsAndShops = limiter.wrap(searchTattooArtistsAndShops);

// State name to abbreviation mapping
const stateNameToAbbreviation: { [key: string]: string } = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
  'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
  'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
  'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
  'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
  'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
};

function getStateAbbreviation(stateName: string): string {
  const lowercaseStateName = stateName.toLowerCase();
  return stateNameToAbbreviation[lowercaseStateName] || stateName;
}

async function performDatabaseSearch(
  supabase: ReturnType<typeof createRouteHandlerClient<Database>>,
  searchTerm: string,
  filters: SearchFilters,
  page: number,
  limit: number
) {
  try {
    console.log('Performing database search with:', { searchTerm, filters, page, limit });

    const { count: totalRecords, error: countError } = await supabase
      .from('business_data')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error checking total records:', countError);
      throw countError;
    }

    console.log(`Total records in business_data table: ${totalRecords}`);

    if (totalRecords === 0) {
      return {
        results: [],
        totalCount: 0,
        page,
        limit,
        searchType: 'general',
        message: 'The database is empty. Please populate the business_data table with data.'
      };
    }

    // Convert state name to abbreviation if necessary
    const stateAbbreviation = getStateAbbreviation(searchTerm);
    console.log(`Searching for state: ${stateAbbreviation}`);

    let query = supabase
      .from('business_data')
      .select('*', { count: 'exact' })
      .eq('State', stateAbbreviation);  // Ensure results are from the correct state

    // Add other filters
    if (filters.style) {
      query = query.ilike('Types', `%${filters.style}%`);
    }
    if (filters.priceRange) {
      query = query.ilike('Types', `%${filters.priceRange}%`);
    }
    if (filters.type && filters.type !== 'both') {
      query = query.ilike('Types', `%${filters.type}%`);
    }

    // Add pagination
    query = query.order('Name').range((page - 1) * limit, page * limit - 1);

    console.log('Executing Supabase query');

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    console.log(`Query returned ${data?.length} results out of ${count} total`);

    if (data && data.length > 0) {
      console.log('Sample result:', data[0]);
    }

    return { 
      results: data || [], 
      totalCount: count ?? 0,
      page,
      limit,
      searchType: 'general'
    };
  } catch (error) {
    console.error('Error in database search:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { searchTerm, filters, searchType, page = 1, limit = 10 } = await request.json();

    console.log('Received search request:', { searchTerm, filters, searchType, page, limit });

    let results;
    if (searchType === 'general') {
      results = await performDatabaseSearch(supabase, searchTerm, filters, page, limit);
    } else if (searchType === 'ai') {
      const aiResults = await rateLimitedSearchTattooArtistsAndShops(searchTerm, filters);
      results = {
        results: aiResults.results,
        totalCount: aiResults.results.length,
        page: 1,
        limit: aiResults.results.length,
        searchType: 'ai'
      };
    } else {
      throw new Error(`Invalid search type: ${searchType}`);
    }

    const endTime = Date.now();
    console.log(`Search completed in ${endTime - startTime}ms`);
    console.log('Search results:', results);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in search:', error);
    return NextResponse.json({ error: 'An error occurred during search' }, { status: 500 });
  }
}