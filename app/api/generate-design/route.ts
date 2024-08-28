import { NextResponse } from 'next/server';
import { generateTattooDesign } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing prompt' }, { status: 400 });
    }

    const result = await generateTattooDesign(prompt);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate-design API:', error);
    return NextResponse.json({ error: 'Failed to generate design' }, { status: 500 });
  }
}