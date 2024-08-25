import { NextResponse } from 'next/server';
import { generateTattooDesign } from '@/lib/openai';
import { rateLimit } from '/Users/hashoutlaw/Desktop/Inkfin/inkfinder/lib/rate-limit.ts';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per minute
});

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const result = await limiter.check(10, 'TATTOO_DESIGN_CACHE');
    if (!result.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { prompt } = await request.json();
    const designResult = await generateTattooDesign(prompt);

    return NextResponse.json(designResult);
  } catch (error) {
    console.error('Error generating tattoo design:', error);
    return NextResponse.json({ error: 'Failed to generate design' }, { status: 500 });
  }
}