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
      business_data: {
        Row: {
          id: string
          Name: string
          clean_address: string
          Phone: string | null
          Website: string | null
          Email: string | null
          Rating: number | null
          Reviews: number | null
          Types: string
          State: string
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          id?: string
          Name: string
          clean_address: string
          Phone?: string | null
          Website?: string | null
          Email?: string | null
          Rating?: number | null
          Reviews?: number | null
          Types: string
          State: string
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          id?: string
          Name?: string
          clean_address?: string
          Phone?: string | null
          Website?: string | null
          Email?: string | null
          Rating?: number | null
          Reviews?: number | null
          Types?: string
          State?: string
          latitude?: number | null
          longitude?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      st_distance: (
        geog1: unknown,
        geog2: unknown,
        use_spheroid?: boolean
      ) => number
      st_setsrid: (geom: unknown, srid: number) => unknown
      st_makepoint: (x: number, y: number) => unknown
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}