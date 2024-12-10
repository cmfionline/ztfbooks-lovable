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
      series: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      languages: {
        Row: {
          id: string
          name: string
          code: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      publishers: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          series_id: string | null
          language_id: string
          cover_image: string | null
          synopsis: string | null
          author_id: string
          publisher_id: string | null
          epub_file: string | null
          publication_date: string | null
          page_count: number | null
          is_free: boolean
          price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          series_id?: string | null
          language_id: string
          cover_image?: string | null
          synopsis?: string | null
          author_id: string
          publisher_id?: string | null
          epub_file?: string | null
          publication_date?: string | null
          page_count?: number | null
          is_free?: boolean
          price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          series_id?: string | null
          language_id?: string
          cover_image?: string | null
          synopsis?: string | null
          author_id?: string
          publisher_id?: string | null
          epub_file?: string | null
          publication_date?: string | null
          page_count?: number | null
          is_free?: boolean
          price?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      books_tags: {
        Row: {
          book_id: string
          tag_id: string
        }
        Insert: {
          book_id: string
          tag_id: string
        }
        Update: {
          book_id?: string
          tag_id?: string
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