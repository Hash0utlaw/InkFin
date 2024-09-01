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
      saved_designs: {
        Row: {
          id: string
          user_id: string
          prompt: string
          image_path?: string
          image_url?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          image_path?: string
          image_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          image_path?: string
          image_url?: string
          created_at?: string
        }
      }
      shared_designs: {
        Row: {
          id: number
          user_id: string
          prompt: string
          design: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          prompt: string
          design: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          prompt?: string
          design?: string
          created_at?: string
        }
      }
      design_history: {
        Row: {
          id: number
          user_id: string
          design_data: Json
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          design_data: Json
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          design_data?: Json
          created_at?: string
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