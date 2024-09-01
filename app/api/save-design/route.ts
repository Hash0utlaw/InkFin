import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { userId, prompt, imageUrl } = await request.json();

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image from OpenAI');
    }
    const imageBlob = await imageResponse.blob();

    // Upload to Supabase Storage
    const fileName = `design_${Date.now()}.png`;
    const bucketName = 'tattoo-designs';
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, imageBlob);

    if (uploadError) throw uploadError;

    // Save to database (note we're not using a public URL here)
    const { data, error } = await supabase
      .from('saved_designs')
      .insert([
        { user_id: userId, prompt, image_path: `${bucketName}/${fileName}` }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in save-design API:', error);
    return NextResponse.json({ error: 'Failed to save design' }, { status: 500 });
  }
}