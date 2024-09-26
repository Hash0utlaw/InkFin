// app/api/generate-design/route.ts
import { NextResponse } from 'next/server';
import replicate from '@/lib/replicate';
import { getCache, setCache } from '@/lib/cache';

interface StableDiffusionInput {
  prompt: string;
  negative_prompt: string;
  guidance: number;
  num_outputs: number;
  aspect_ratio: string;
  output_format: string;
  output_quality: number;
  prompt_strength: number;
  num_inference_steps: number;
  image?: string;
  go_fast: boolean;  // Make this optional
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const options = JSON.parse(formData.get('options') as string);
    const referenceImage = formData.get('referenceImage') as File | null;

    const cacheKey = `design:${JSON.stringify({ prompt, options, hasReferenceImage: !!referenceImage })}`;
    const cachedResult = getCache(cacheKey);

    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    const enhancedPrompt = `Tattoo design: ${prompt}. Style: ${options.style}. Size: ${options.size}. Color scheme: ${options.colorScheme}. Placement: ${options.placement}. Ensure clear lines and appropriate detail for a tattoo.`;

    const input: StableDiffusionInput = {
      prompt: enhancedPrompt,
      negative_prompt: "blurry, fuzzy, low quality, distorted, ugly, disproportionate, unrealistic",
      go_fast: true,
      guidance: 3.5,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      prompt_strength: 0.8,
      num_inference_steps: 28
    };

    if (referenceImage) {
      const imageData = await referenceImage.arrayBuffer();
      const base64Image = Buffer.from(imageData).toString('base64');
      input.image = `data:image/${referenceImage.type};base64,${base64Image}`;
    }

    // Use a Stable Diffusion model fine-tuned for tattoo designs
    // Note: Replace with an actual fine-tuned model for tattoos when available
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
    console.error("Error generating tattoo design:", error);
    return NextResponse.json({ error: "Failed to generate tattoo design. Please try again." }, { status: 500 });
  }
}


