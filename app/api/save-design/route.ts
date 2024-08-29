import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt, design } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('saved_designs')
      .insert([{ user_id: user.id, prompt, design }]);

    if (error) throw error;

    return NextResponse.json({ message: 'Design saved successfully' });
  } catch (error) {
    console.error('Error saving design:', error);
    return NextResponse.json({ error: 'Failed to save design' }, { status: 500 });
  }
}