'use client'
// components/TattooDesignGenerator.tsx

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import DesignModifier from './DesignModifier';
import ErrorMessage from './ErrorMessage';
import TattooLoadingAnimation from './TattooLoadingAnimation';

interface DesignResult {
  imageUrl: string;
  error?: string;
}

interface DesignOptions {
  style: string;
  size: string;
  colorScheme: string;
  placement: string;
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
  const [designOptions, setDesignOptions] = useState<DesignOptions>({
    style: '',
    size: '',
    colorScheme: '',
    placement: '',
  });
  const [generatedImage, setGeneratedImage] = useState<DesignResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [isServiceDown, setIsServiceDown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleOptionChange = (option: keyof DesignOptions, value: string) => {
    setDesignOptions(prev => ({ ...prev, [option]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReferenceImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) {
      setError('Application is not properly initialized. Please try again later.');
      return;
    }
    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);
    setIsServiceDown(false);

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('options', JSON.stringify(designOptions));
    if (referenceImage) {
      formData.append('referenceImage', referenceImage);
    }

    try {
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 504) {
          throw new Error('The design generation service is currently unavailable. Please try again later.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DesignResult = await response.json();
      if (result.error) {
        throw new Error(result.error);
      } else if (result.imageUrl) {
        setGeneratedImage(result);
      } else {
        throw new Error('No image was generated. Please try again.');
      }
    } catch (error) {
      console.error('Error generating design:', error);
      if (error instanceof Error) {
        if (error.message.includes('service is currently unavailable')) {
          setIsServiceDown(true);
        }
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsServiceDown(false);
    handleSubmit(new Event('submit') as any);
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
    if (!generatedImage || !supabase) {
      console.error('Cannot save design: generatedImage or supabase is null');
      return;
    }

    try {
      const response = await fetch('/api/save-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          prompt,
          imageUrl: generatedImage.imageUrl,
          options: designOptions,
          customColors
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      console.log('Design saved successfully:', result);
      alert('Design saved successfully!');
    } catch (error) {
      console.error('Error saving design:', error);
      alert(`Failed to save design. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const shareDesign = async (userId: string) => {
    if (!generatedImage || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('shared_designs')
        .insert([
          { user_id: userId, prompt, design: generatedImage.imageUrl, options: designOptions, custom_colors: customColors }
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
      console.error('Error sharing design:', error);
      alert(`Failed to share design. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleModifyDesign = async (colors: string[], style: string) => {
    if (!generatedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/modify-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: generatedImage.imageUrl,
          colors,
          style,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DesignResult = await response.json();
      if (result.error) {
        setError(result.error);
      } else if (result.imageUrl) {
        setGeneratedImage(result);
        setCustomColors(colors);
        setDesignOptions(prev => ({ ...prev, style }));
      } else {
        setError('Failed to modify design. Please try again.');
      }
    } catch (error) {
      setError('Failed to modify design. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      {isServiceDown ? (
        <ErrorMessage 
          message="The design generation service is currently down. We apologize for the inconvenience. Please try again later."
        />
      ) : error ? (
        <ErrorMessage 
          message={error}
          onRetry={handleRetry}
        />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={4}
              placeholder="Describe your tattoo idea in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <select
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md"
              value={designOptions.style}
              onChange={(e) => handleOptionChange('style', e.target.value)}
            >
              <option value="">Select Style</option>
              <option value="Traditional">Traditional</option>
              <option value="Realistic">Realistic</option>
              <option value="Watercolor">Watercolor</option>
              <option value="Geometric">Geometric</option>
              <option value="Minimalist">Minimalist</option>
            </select>
            <select
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md"
              value={designOptions.size}
              onChange={(e) => handleOptionChange('size', e.target.value)}
            >
              <option value="">Select Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
            <select
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md"
              value={designOptions.colorScheme}
              onChange={(e) => handleOptionChange('colorScheme', e.target.value)}
            >
              <option value="">Select Color Scheme</option>
              <option value="Black and Gray">Black and Gray</option>
              <option value="Full Color">Full Color</option>
              <option value="Pastel">Pastel</option>
            </select>
            <select
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md"
              value={designOptions.placement}
              onChange={(e) => handleOptionChange('placement', e.target.value)}
            >
              <option value="">Select Placement</option>
              <option value="Arm">Arm</option>
              <option value="Leg">Leg</option>
              <option value="Back">Back</option>
              <option value="Chest">Chest</option>
            </select>
            <div className="mb-4">
              <label htmlFor="referenceImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Reference Image (optional)
              </label>
              <input
                type="file"
                id="referenceImage"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out disabled:bg-blue-300 dark:disabled:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? 'Generating Your Design...' : 'Generate Tattoo Design'}
            </button>
          </form>
          {isLoading ? (
            <TattooLoadingAnimation />
          ) : generatedImage && generatedImage.imageUrl ? (
            <div className="text-center mt-6">
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
              <DesignModifier onModifyDesign={handleModifyDesign} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}