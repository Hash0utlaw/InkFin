'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArtistForm from '@/components/ArtistForm';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

type Artist = Database['public']['Tables']['artists']['Row'];

export default function CreateArtistPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleCreate = async (data: Partial<Artist>) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError("You must be logged in to create a profile.");
      return;
    }

    const { data: newArtist, error } = await supabase
      .from('artists')
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else if (newArtist) {
      router.push(`/artist/${newArtist.id}`);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Artist Profile</h1>
      <ArtistForm onSubmit={handleCreate} />
    </div>
  );
}