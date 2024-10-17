'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ShopForm from '@/components/ShopForm';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

type Shop = Database['public']['Tables']['shops']['Row'];

export default function CreateShopPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleCreate = async (data: Partial<Shop>) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError("You must be logged in to create a profile.");
      return;
    }

    const { data: newShop, error } = await supabase
      .from('shops')
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else if (newShop) {
      router.push(`/shop/${newShop.id}`);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Shop Profile</h1>
      <ShopForm onSubmit={handleCreate} />
    </div>
  );
}