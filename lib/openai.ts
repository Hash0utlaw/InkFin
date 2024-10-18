import OpenAI from 'openai';
import { getCache, setCache } from './cache';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface Artist {
  name: string;
  type: 'artist';
  style?: string;
  location: string;
  priceRange: string;
  experience?: string;
  specialties?: string[];
  portfolio?: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface Shop {
  name: string;
  type: 'shop';
  location: string;
  priceRange: string;
  services?: string[];
  artistCount?: number;
  rating?: number;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface SearchResult {
  results: (Artist | Shop)[];
  error?: string;
}

export interface SearchFilters {
  type: 'artist' | 'shop' | 'both';
  priceRange: string;
  location: string;
  style: string;
  experience?: string;
  rating?: number;
}

export async function searchTattooArtistsAndShops(query: string, filters: SearchFilters): Promise<SearchResult> {
  const cacheKey = `search:${query}:${JSON.stringify(filters)}`;
  const cachedResult = getCache(cacheKey);

  if (cachedResult) {
    return cachedResult as SearchResult;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant specializing in finding tattoo artists and shops based on specific criteria. Respond with a JSON array of objects, where each object represents an artist or shop with the following properties:
          - name: string
          - type: 'artist' or 'shop'
          - style: string (for artists only)
          - location: string
          - priceRange: string
          - experience: string (for artists only)
          - specialties: string[] (for artists only)
          - portfolio: string (URL, for artists only)
          - services: string[] (for shops only)
          - artistCount: number (for shops only)
          - rating: number (1-5 scale, for shops only)
          - phone: string
          - email: string
          - website: string
          - instagram: string
          - facebook: string
          - twitter: string
          
          Provide detailed and realistic results, including plausible contact information. If no exact matches are found, suggest similar alternatives that best fit the criteria.`
        },
        {
          role: "user",
          content: `Based on the following criteria, suggest tattoo artists and/or shops:
          Query: ${query}
          Type: ${filters.type}
          Price Range: ${filters.priceRange}
          Location: ${filters.location}
          Style: ${filters.style}
          Experience: ${filters.experience || 'Any'}
          Minimum Rating: ${filters.rating || 'Any'}
          
          Provide up to 8 results that best match these criteria. Ensure the results are diverse and cater to different aspects of the search criteria. Include realistic contact information for each result.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error('No content in OpenAI response');
      return { results: [], error: 'No results found' };
    }

    console.log('Raw OpenAI response:', content);

    const parsedResults = parseOpenAIResponse(content);
    const result: SearchResult = { results: parsedResults };
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return { results: [], error: 'Failed to search for tattoo artists and shops' };
  }
}

function parseOpenAIResponse(content: string): (Artist | Shop)[] {
  try {
    const cleanedContent = content.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '');
    const parsedContent = JSON.parse(cleanedContent);

    if (Array.isArray(parsedContent)) {
      return parsedContent.filter(isValidResult);
    } else {
      console.error('Parsed content is not an array:', parsedContent);
      return [];
    }
  } catch (parseError) {
    console.error('Error parsing OpenAI response:', parseError);
    const manuallyParsed = content.match(/\{[^}]+\}/g);
    if (manuallyParsed) {
      return manuallyParsed.map(item => {
        try {
          const parsed = JSON.parse(item.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, ''));
          return isValidResult(parsed) ? parsed : null;
        } catch (e) {
          console.error('Error parsing individual item:', e);
          return null;
        }
      }).filter((item): item is Artist | Shop => item !== null);
    }
    return [];
  }
}

function isValidResult(item: any): item is Artist | Shop {
  if (item && typeof item === 'object' && 'name' in item && 'type' in item && 'location' in item && 'priceRange' in item) {
    if (item.type === 'artist') {
      return (
        'style' in item &&
        (!('experience' in item) || typeof item.experience === 'string') &&
        (!('specialties' in item) || Array.isArray(item.specialties)) &&
        (!('portfolio' in item) || typeof item.portfolio === 'string')
      );
    } else if (item.type === 'shop') {
      return (
        (!('services' in item) || Array.isArray(item.services)) &&
        (!('artistCount' in item) || typeof item.artistCount === 'number') &&
        (!('rating' in item) || (typeof item.rating === 'number' && item.rating >= 1 && item.rating <= 5))
      );
    }
  }
  return false;
}