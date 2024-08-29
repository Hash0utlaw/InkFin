'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

interface DesignResult {
  imageUrl: string;
  error?: string;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export default function TattooDesignGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<DesignResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initSupabase = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase environment variables are not set');
        }

        if (!isValidUrl(supabaseUrl)) {
          throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
        }

        if (supabaseAnonKey.length < 30) {
          throw new Error('Supabase API key seems to be invalid or too short');
        }

        let supabaseClient;
        try {
          supabaseClient = createClientComponentClient<Database>();
        } catch (clientError) {
          throw new Error(`Failed to create Supabase client: ${clientError instanceof Error ? clientError.message : 'Unknown error'}`);
        }

        setSupabase(supabaseClient);

        const { data, error } = await supabaseClient.from('saved_designs').select('id').limit(1);
        if (error) {
          throw new Error(`Failed to connect to Supabase: ${error.message}`);
        }
      } catch (error) {
        setError(`Failed to initialize application. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    initSupabase();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) {
      setError('Application is not properly initialized. Please try again later.');
      return;
    }
    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DesignResult = await response.json();
      if (result.error) {
        setError(result.error);
      } else if (result.imageUrl) {
        setGeneratedImage(result);
      } else {
        setError('No image was generated. Please try again.');
      }
    } catch (error) {
      setError('Failed to generate design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOrShare = async (action: 'save' | 'share') => {
    if (!supabase) {
      setError('Application is not properly initialized. Please try again later.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const confirmed = window.confirm(`Please sign in to ${action} designs. Would you like to sign in now?`);
      if (confirmed) {
        router.push('/signin');
      }
      return;
    }

    if (action === 'save') {
      await saveDesign(user.id);
    } else {
      await shareDesign(user.id);
    }
  };

  const saveDesign = async (userId: string) => {
    if (!generatedImage || !supabase) return;

    try {
      const { error } = await supabase
        .from('saved_designs')
        .insert([
          { user_id: userId, prompt, design: generatedImage.imageUrl }
        ]);

      if (error) throw error;
      alert('Design saved successfully!');
    } catch (error) {
      alert('Failed to save design. Please try again.');
    }
  };

  const shareDesign = async (userId: string) => {
    if (!generatedImage || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('shared_designs')
        .insert([
          { user_id: userId, prompt, design: generatedImage.imageUrl }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const shareUrl = `${window.location.origin}/shared/${data[0].id}`;
        alert(`Design shared successfully! Share this URL: ${shareUrl}`);
      } else {
        throw new Error('Failed to get shared design data');
      }
    } catch (error) {
      alert('Failed to share design. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      {error ? (
        <div>
          <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
          <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
            NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mb-6">
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={4}
              placeholder="Describe your tattoo idea in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              type="submit" 
              className="mt-4 w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out disabled:bg-blue-300 dark:disabled:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? 'Generating Your Design...' : 'Generate Tattoo Design'}
            </button>
          </form>
          {generatedImage && generatedImage.imageUrl && (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your Generated Design:</h3>
              <div className="relative w-full h-64 md:h-96">
                <Image 
                  src={generatedImage.imageUrl} 
                  alt="Generated tattoo design" 
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-md shadow-lg"
                />
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                This is an AI-generated design based on your description. Feel free to use this as inspiration for your tattoo artist.
              </p>
              <div className="mt-4 space-x-4">
                <button 
                  onClick={() => handleSaveOrShare('save')}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
                >
                  Save Design
                </button>
                <button 
                  onClick={() => handleSaveOrShare('share')}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition duration-300 ease-in-out"
                >
                  Share Design
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}