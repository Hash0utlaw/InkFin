import OpenAI from 'openai';
import { getCache, setCache } from './cache';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface Artist {
  name: string;
  style: string;
  location: string;
  priceRange: string;
}

export interface SearchResult {
  artists: Artist[];
  error?: string;
}

export interface DesignResult {
  imageUrl: string;
  error?: string;
}

export async function searchTattooArtists(query: string): Promise<SearchResult> {
  const cacheKey = `search:${query}`;
  const cachedResult = getCache(cacheKey);
  
  if (cachedResult) {
    return cachedResult as SearchResult;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {role: "system", content: "You are a helpful assistant that finds tattoo artists based on specific criteria. Always respond with a JSON array of objects, where each object represents an artist with 'name', 'style', 'location', and 'priceRange' properties. If you can't provide results, respond with an empty array []."},
        {role: "user", content: `Based on the following criteria, suggest tattoo artists:
${query}
Provide 5 artists that best match these criteria. If no exact matches are found, suggest similar alternatives.`}
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error('No content in OpenAI response');
      return { artists: [], error: 'No results found' };
    }

    console.log('Raw OpenAI response:', content);

    try {
      const parsedContent = JSON.parse(content);
      if (Array.isArray(parsedContent)) {
        const result: SearchResult = { artists: parsedContent };
        setCache(cacheKey, result);
        return result;
      } else {
        console.error('Parsed content is not an array:', parsedContent);
        return { artists: [], error: 'Invalid response format' };
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return { artists: [], error: 'Failed to parse search results' };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return { artists: [], error: 'Failed to search for tattoo artists' };
  }
}

export async function generateTattooDesign(prompt: string): Promise<DesignResult> {
  const cacheKey = `design:${prompt}`;
  const cachedResult = getCache(cacheKey);
  
  if (cachedResult) {
    return cachedResult as DesignResult;
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",  // Specifying the DALL-E 3 model
      prompt: `Tattoo design: ${prompt}`,
      n: 1,
      size: "1024x1024",  // DALL-E 3 supports 1024x1024, 1792x1024, or 1024x1792
      quality: "standard",  // Can be "standard" or "hd"
      style: "vivid",  // Can be "vivid" or "natural"
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