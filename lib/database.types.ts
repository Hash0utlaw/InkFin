// lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          bio: string | null;
          location: string | null;
          styles: string[] | null;
          price_range: string | null;
          portfolio_images: string[] | null;
          years_of_experience: number | null;
          instagram_handle: string | null;
          website_url: string | null;
          created_at: string;
          updated_at: string;
          type: 'artist';
        }
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          bio?: string | null;
          location?: string | null;
          styles?: string[] | null;
          price_range?: string | null;
          portfolio_images?: string[] | null;
          years_of_experience?: number | null;
          instagram_handle?: string | null;
          website_url?: string | null;
          created_at?: string;
          updated_at?: string;
          type?: 'artist';
        }
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          bio?: string | null;
          location?: string | null;
          styles?: string[] | null;
          price_range?: string | null;
          portfolio_images?: string[] | null;
          years_of_experience?: number | null;
          instagram_handle?: string | null;
          website_url?: string | null;
          created_at?: string;
          updated_at?: string;
          type?: 'artist';
        }
      }
      shops: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          location: string | null;
          price_range: string | null;
          services: string[] | null;
          images: string[] | null;
          website_url: string | null;
          created_at: string;
          updated_at: string;
          type: 'shop';
        }
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          location?: string | null;
          price_range?: string | null;
          services?: string[] | null;
          images?: string[] | null;
          website_url?: string | null;
          created_at?: string;
          updated_at?: string;
          type?: 'shop';
        }
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          location?: string | null;
          price_range?: string | null;
          services?: string[] | null;
          images?: string[] | null;
          website_url?: string | null;
          created_at?: string;
          updated_at?: string;
          type?: 'shop';
        }
      }
      saved_designs: {
        Row: {
          id: string;
          user_id: string;
          prompt: string;
          image_path?: string;
          image_url?: string;
          created_at: string;
        }
        Insert: {
          id?: string;
          user_id: string;
          prompt: string;
          image_path?: string;
          image_url?: string;
          created_at?: string;
        }
        Update: {
          id?: string;
          user_id?: string;
          prompt?: string;
          image_path?: string;
          image_url?: string;
          created_at?: string;
        }
      }
      shared_designs: {
        Row: {
          id: number;
          user_id: string;
          prompt: string;
          design: string;
          created_at: string;
        }
        Insert: {
          id?: number;
          user_id: string;
          prompt: string;
          design: string;
          created_at?: string;
        }
        Update: {
          id?: number;
          user_id?: string;
          prompt?: string;
          design?: string;
          created_at?: string;
        }
      }
      design_history: {
        Row: {
          id: number;
          user_id: string;
          design_data: Json;
          created_at: string;
        }
        Insert: {
          id?: number;
          user_id: string;
          design_data: Json;
          created_at?: string;
        }
        Update: {
          id?: number;
          user_id?: string;
          design_data?: Json;
          created_at?: string;
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}