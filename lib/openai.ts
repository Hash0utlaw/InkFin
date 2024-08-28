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
}

export interface Shop {
  name: string;
  type: 'shop';
  location: string;
  priceRange: string;
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
        {role: "system", content: `You are a helpful assistant that finds tattoo artists and shops based on specific criteria. Always respond with a JSON array of objects, where each object represents an artist or shop with 'name', 'type' (either 'artist' or 'shop'), 'style' (for artists only), 'location', and 'priceRange' properties. If you can't provide results, respond with an empty array [].`},
        {role: "user", content: `Based on the following criteria, suggest tattoo artists and/or shops:
Query: ${query}
Type: ${filters.type}
Price Range: ${filters.priceRange}
Location: ${filters.location}
Style: ${filters.style}
Provide up to 5 results that best match these criteria. If no exact matches are found, suggest similar alternatives.`}
      ],
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
    // Clean the content before parsing
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
    // Attempt to clean and parse the response manually
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
  return (
    item &&
    typeof item === 'object' &&
    'name' in item &&
    'type' in item &&
    'location' in item &&
    'priceRange' in item &&
    (item.type === 'artist' || item.type === 'shop')
  );
}

export async function generateTattooDesign(prompt: string): Promise<{ imageUrl: string; error?: string }> {
  const cacheKey = `design:${prompt}`;
  const cachedResult = getCache(cacheKey);

  if (cachedResult) {
    return cachedResult as { imageUrl: string; error?: string };
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Tattoo design: ${prompt}`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL in the response");
    }

    const result = { imageUrl };
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error generating tattoo design:", error);
    return { imageUrl: "", error: "Failed to generate tattoo design. Please try again." };
  }
}