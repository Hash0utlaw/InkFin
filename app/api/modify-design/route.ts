// app/api/modify-design/route.ts
import { NextResponse } from 'next/server';
import replicate from '@/lib/replicate';
import { getCache, setCache } from '@/lib/cache';

interface ModifyDesignInput {
  prompt: string;
  guidance: number;
  num_outputs: number;
  aspect_ratio: string;
  output_format: string;
  output_quality: number;
  prompt_strength: number;
  num_inference_steps: number;
  image?: string;
  go_fast: boolean;
}

export async function POST(request: Request) {
  try {
    const { imageUrl, colors, style } = await request.json();
    const cacheKey = `designModification:${imageUrl}:${colors.join(',')}:${style}`;
    const cachedResult = getCache(cacheKey);

    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    const modificationPrompt = `Transform this tattoo design. Apply the color palette: ${colors.join(', ')}. Change the style to ${style}. Maintain the original design's core elements and subject matter.`;

    const input: ModifyDesignInput = {
      prompt: modificationPrompt,
      image: imageUrl,
      go_fast: true,
      guidance: 3.5,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      prompt_strength: 0.8,
      num_inference_steps: 28
    };

    const output = await replicate.run(
      "black-forest-labs/flux-dev",
      { input }
    );

    if (!output || !Array.isArray(output) || output.length === 0) {
      throw new Error("No image generated");
    }

    const result = { imageUrl: output[0] };
    setCache(cacheKey, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error modifying design:", error);
    return NextResponse.json({ error: "Failed to modify the design. Please try again." }, { status: 500 });
  }
}