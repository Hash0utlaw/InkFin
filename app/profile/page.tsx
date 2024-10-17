'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { Users, Store, ArrowLeft, Trash2 } from 'lucide-react';

type Profile = {
  type: 'artist' | 'shop';
  id: string;
};

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function checkProfile() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/signin');
        return;
      }

      const { data: artist } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (artist) {
        setProfile({ type: 'artist', id: artist.id });
        setIsLoading(false);
        return;
      }

      const { data: shop } = await supabase
        .from('shops')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (shop) {
        setProfile({ type: 'shop', id: shop.id });
        setIsLoading(false);
        return;
      }

      setProfile(null);
      setIsLoading(false);
    }

    checkProfile();
  }, [router, supabase]);

  const handleDeleteProfile = async () => {
    if (!profile) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete your ${profile.type} profile? This action cannot be undone.`);
    
    if (confirmDelete) {
      const { error } = await supabase
        .from(profile.type === 'artist' ? 'artists' : 'shops')
        .delete()
        .eq('id', profile.id);

      if (error) {
        console.error('Error deleting profile:', error);
        alert('Failed to delete profile. Please try again.');
      } else {
        setProfile(null);
        alert('Profile deleted successfully.');
      }
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center mb-4 text-blue-500 hover:text-blue-600">
        <ArrowLeft className="mr-2" /> Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
      
      {profile ? (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            {profile.type === 'artist' ? <Users className="mr-2" /> : <Store className="mr-2" />}
            {profile.type === 'artist' ? 'Artist Profile' : 'Shop Profile'}
          </h2>
          <div className="flex justify-between items-center">
            <Link href={`/${profile.type}/${profile.id}`} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
              View Profile
            </Link>
            <button onClick={handleDeleteProfile} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 flex items-center">
              <Trash2 className="mr-2" /> Delete Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Users className="mr-2" /> Artist Profile
            </h2>
            <p className="mb-4">Create a profile to showcase your work and connect with potential clients.</p>
            <Link href="/artist/create" className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition duration-300 inline-flex items-center">
              <Users className="mr-2" /> Create Artist Profile
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Store className="mr-2" /> Shop Profile
            </h2>
            <p className="mb-4">Create a profile for your tattoo shop to attract customers and showcase your artists.</p>
            <Link href="/shop/create" className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition duration-300 inline-flex items-center">
              <Store className="mr-2" /> Create Shop Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}