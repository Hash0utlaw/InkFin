import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { userId, prompt, imageUrl } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error('Failed to fetch image');
    const imageBlob = await imageResponse.blob();

    // Upload to Supabase Storage
    const fileName = `design_${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('tattoo-designs')
      .upload(fileName, imageBlob);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('tattoo-designs')
      .getPublicUrl(fileName);

    // Save to database
    const { data, error } = await supabase
      .from('saved_designs')
      .insert([
        { user_id: userId, prompt, image_url: publicUrl }
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in save-design API:', error);
    return NextResponse.json({ error: 'Failed to save design' }, { status: 500 });
  }
}