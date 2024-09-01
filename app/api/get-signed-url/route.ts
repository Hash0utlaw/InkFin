import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const imagePath = request.nextUrl.searchParams.get('path');

  if (!imagePath) {
    return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
  }

  try {
    let path = imagePath;
    
    // Check if the path is a full URL
    if (imagePath.startsWith('http')) {
      // Extract the path from the URL
      const url = new URL(imagePath);
      path = url.pathname.split('/').slice(4).join('/');
    }

    // Remove 'tattoo-designs/' from the beginning if it exists
    path = path.replace(/^tattoo-designs\//, '');

    console.log('Processing path:', path); // Add this log

    const { data, error } = await supabase
      .storage
      .from('tattoo-designs')
      .createSignedUrl(path, 60); // URL expires in 60 seconds

    if (error) throw error;

    console.log('Signed URL created:', data.signedUrl); // Add this log

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (error) {
    console.error('Error creating signed URL:', error);
    return NextResponse.json({ error: 'Failed to create signed URL' }, { status: 500 });
  }
}