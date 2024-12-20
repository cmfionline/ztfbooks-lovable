export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ad_ab_tests: {
        Row: {
          ad_id: string | null
          created_at: string
          end_date: string
          id: string
          start_date: string
          test_name: string
          updated_at: string
          variant_a: string | null
          variant_b: string | null
          winner_variant: string | null
        }
        Insert: {
          ad_id?: string | null
          created_at?: string
          end_date: string
          id?: string
          start_date: string
          test_name: string
          updated_at?: string
          variant_a?: string | null
          variant_b?: string | null
          winner_variant?: string | null
        }
        Update: {
          ad_id?: string | null
          created_at?: string
          end_date?: string
          id?: string
          start_date?: string
          test_name?: string
          updated_at?: string
          variant_a?: string | null
          variant_b?: string | null
          winner_variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_ab_tests_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_ab_tests_variant_a_fkey"
            columns: ["variant_a"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_ab_tests_variant_b_fkey"
            columns: ["variant_b"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_ab_tests_winner_variant_fkey"
            columns: ["winner_variant"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_analytics: {
        Row: {
          ab_test_group: string | null
          ad_id: string
          clicks: number | null
          conversions: number | null
          created_at: string
          date: string
          device_type: string | null
          id: string
          impressions: number | null
          revenue: number | null
        }
        Insert: {
          ab_test_group?: string | null
          ad_id: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          date: string
          device_type?: string | null
          id?: string
          impressions?: number | null
          revenue?: number | null
        }
        Update: {
          ab_test_group?: string | null
          ad_id?: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          date?: string
          device_type?: string | null
          id?: string
          impressions?: number | null
          revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_analytics_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_books: {
        Row: {
          ad_id: string
          book_id: string
          discount_end_date: string | null
          discount_percentage: number
          discount_start_date: string | null
          discounted_price: number | null
          original_price: number
        }
        Insert: {
          ad_id: string
          book_id: string
          discount_end_date?: string | null
          discount_percentage: number
          discount_start_date?: string | null
          discounted_price?: number | null
          original_price: number
        }
        Update: {
          ad_id?: string
          book_id?: string
          discount_end_date?: string | null
          discount_percentage?: number
          discount_start_date?: string | null
          discounted_price?: number | null
          original_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "ad_books_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_discount_analytics: {
        Row: {
          ad_id: string
          created_at: string | null
          customer_segment: Json | null
          id: string
          redemption_count: number
          roi: number | null
          sales_impact: number
          updated_at: string | null
        }
        Insert: {
          ad_id: string
          created_at?: string | null
          customer_segment?: Json | null
          id?: string
          redemption_count?: number
          roi?: number | null
          sales_impact?: number
          updated_at?: string | null
        }
        Update: {
          ad_id?: string
          created_at?: string | null
          customer_segment?: Json | null
          id?: string
          redemption_count?: number
          roi?: number | null
          sales_impact?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_discount_analytics_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["ad_type_status"] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["ad_type_status"] | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["ad_type_status"] | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ads: {
        Row: {
          ab_test_group: string | null
          content: string
          created_at: string
          cta_text: string | null
          discount_strategy_id: string | null
          discount_type: string | null
          discount_value: number | null
          end_date: string
          html_content: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_stackable: boolean | null
          min_books_count: number | null
          min_purchase_amount: number | null
          name: string
          placement: Database["public"]["Enums"]["ad_placement"]
          preview_mobile_url: string | null
          preview_tablet_url: string | null
          start_date: string
          target_audience: Json | null
          type: Database["public"]["Enums"]["ad_type"]
          updated_at: string
          video_url: string | null
        }
        Insert: {
          ab_test_group?: string | null
          content: string
          created_at?: string
          cta_text?: string | null
          discount_strategy_id?: string | null
          discount_type?: string | null
          discount_value?: number | null
          end_date: string
          html_content?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_stackable?: boolean | null
          min_books_count?: number | null
          min_purchase_amount?: number | null
          name: string
          placement: Database["public"]["Enums"]["ad_placement"]
          preview_mobile_url?: string | null
          preview_tablet_url?: string | null
          start_date: string
          target_audience?: Json | null
          type: Database["public"]["Enums"]["ad_type"]
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          ab_test_group?: string | null
          content?: string
          created_at?: string
          cta_text?: string | null
          discount_strategy_id?: string | null
          discount_type?: string | null
          discount_value?: number | null
          end_date?: string
          html_content?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_stackable?: boolean | null
          min_books_count?: number | null
          min_purchase_amount?: number | null
          name?: string
          placement?: Database["public"]["Enums"]["ad_placement"]
          preview_mobile_url?: string | null
          preview_tablet_url?: string | null
          start_date?: string
          target_audience?: Json | null
          type?: Database["public"]["Enums"]["ad_type"]
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ads_discount_strategy_id_fkey"
            columns: ["discount_strategy_id"]
            isOneToOne: false
            referencedRelation: "discount_strategies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ads_discount_strategy"
            columns: ["discount_strategy_id"]
            isOneToOne: false
            referencedRelation: "discount_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      authorized_devices: {
        Row: {
          created_at: string
          device_id: string
          device_name: string | null
          id: string
          is_active: boolean | null
          last_active: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          device_name?: string | null
          id?: string
          is_active?: boolean | null
          last_active?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          device_name?: string | null
          id?: string
          is_active?: boolean | null
          last_active?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "authorized_devices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          address: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          facebook_url: string | null
          id: string
          instagram_url: string | null
          mobile: string | null
          name: string
          nationality: string | null
          photo: string | null
          twitter_url: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          mobile?: string | null
          name: string
          nationality?: string | null
          photo?: string | null
          twitter_url?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          mobile?: string | null
          name?: string
          nationality?: string | null
          photo?: string | null
          twitter_url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      book_reviews: {
        Row: {
          book_id: string | null
          created_at: string | null
          id: string
          is_verified_purchase: boolean | null
          rating: number | null
          review_text: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          is_verified_purchase?: boolean | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          is_verified_purchase?: boolean | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          book_id: string | null
          created_at: string | null
          id: string
          note: string | null
          page_number: number
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          note?: string | null
          page_number: number
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          note?: string | null
          page_number?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author_id: string
          cover_image: string | null
          created_at: string
          discount_end_date: string | null
          discount_percentage: number | null
          discount_start_date: string | null
          epub_file: string | null
          id: string
          is_featured: boolean | null
          is_featured_discount: boolean | null
          is_free: boolean | null
          is_top_selling: boolean | null
          language_id: string
          page_count: number | null
          price: number | null
          publication_date: string | null
          publisher_id: string | null
          series_id: string | null
          synopsis: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          cover_image?: string | null
          created_at?: string
          discount_end_date?: string | null
          discount_percentage?: number | null
          discount_start_date?: string | null
          epub_file?: string | null
          id?: string
          is_featured?: boolean | null
          is_featured_discount?: boolean | null
          is_free?: boolean | null
          is_top_selling?: boolean | null
          language_id: string
          page_count?: number | null
          price?: number | null
          publication_date?: string | null
          publisher_id?: string | null
          series_id?: string | null
          synopsis?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          cover_image?: string | null
          created_at?: string
          discount_end_date?: string | null
          discount_percentage?: number | null
          discount_start_date?: string | null
          epub_file?: string | null
          id?: string
          is_featured?: boolean | null
          is_featured_discount?: boolean | null
          is_free?: boolean | null
          is_top_selling?: boolean | null
          language_id?: string
          page_count?: number | null
          price?: number | null
          publication_date?: string | null
          publisher_id?: string | null
          series_id?: string | null
          synopsis?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "books_tags_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_discount_books: {
        Row: {
          book_id: string
          discount_id: string
        }
        Insert: {
          book_id: string
          discount_id: string
        }
        Update: {
          book_id?: string
          discount_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_discount_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_discount_books_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "bulk_discounts"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_discounts: {
        Row: {
          created_at: string
          discount_end_date: string
          discount_percentage: number
          discount_start_date: string
          id: string
          is_featured: boolean | null
          name: string
          series_id: string | null
          tag_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_end_date: string
          discount_percentage: number
          discount_start_date: string
          id?: string
          is_featured?: boolean | null
          name: string
          series_id?: string | null
          tag_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_end_date?: string
          discount_percentage?: number
          discount_start_date?: string
          id?: string
          is_featured?: boolean | null
          name?: string
          series_id?: string | null
          tag_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_discounts_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_discounts_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          button_link: string | null
          button_text: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          order_index: number | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          order_index?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_activities: {
        Row: {
          activity_type: string
          book_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          book_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          book_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_activities_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_analytics: {
        Row: {
          created_at: string
          date: string
          discount_id: string | null
          id: string
          redemptions: number | null
          revenue_impact: number | null
        }
        Insert: {
          created_at?: string
          date: string
          discount_id?: string | null
          id?: string
          redemptions?: number | null
          revenue_impact?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          discount_id?: string | null
          id?: string
          redemptions?: number | null
          revenue_impact?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_analytics_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_books: {
        Row: {
          book_id: string
          discount_id: string
        }
        Insert: {
          book_id: string
          discount_id: string
        }
        Update: {
          book_id?: string
          discount_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discount_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_books_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_strategies: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          is_stackable: boolean | null
          min_books_count: number | null
          min_purchase_amount: number | null
          name: string
          type: Database["public"]["Enums"]["discount_strategy_type"]
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_stackable?: boolean | null
          min_books_count?: number | null
          min_purchase_amount?: number | null
          name: string
          type: Database["public"]["Enums"]["discount_strategy_type"]
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_stackable?: boolean | null
          min_books_count?: number | null
          min_purchase_amount?: number | null
          name?: string
          type?: Database["public"]["Enums"]["discount_strategy_type"]
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      discount_usage: {
        Row: {
          discount_id: string
          id: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          discount_id: string
          id?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          discount_id?: string
          id?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discount_usage_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          created_at: string
          current_total_uses: number | null
          end_date: string
          id: string
          is_active: boolean | null
          is_stackable: boolean | null
          max_total_uses: number | null
          max_uses_per_user: number | null
          min_books_count: number | null
          min_purchase_amount: number | null
          name: string
          start_date: string
          type: Database["public"]["Enums"]["discount_type"]
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          current_total_uses?: number | null
          end_date: string
          id?: string
          is_active?: boolean | null
          is_stackable?: boolean | null
          max_total_uses?: number | null
          max_uses_per_user?: number | null
          min_books_count?: number | null
          min_purchase_amount?: number | null
          name: string
          start_date: string
          type: Database["public"]["Enums"]["discount_type"]
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          current_total_uses?: number | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          is_stackable?: boolean | null
          max_total_uses?: number | null
          max_uses_per_user?: number | null
          min_books_count?: number | null
          min_purchase_amount?: number | null
          name?: string
          start_date?: string
          type?: Database["public"]["Enums"]["discount_type"]
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      faq_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          group_id: string
          id: string
          order_index: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          group_id: string
          id?: string
          order_index?: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          group_id?: string
          id?: string
          order_index?: number
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faqs_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "faq_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_sections: {
        Row: {
          app_store_link: string | null
          created_at: string
          hero_image: string | null
          id: string
          is_active: boolean | null
          play_store_link: string | null
          primary_button_link: string
          primary_button_text: string
          secondary_button_link: string
          secondary_button_text: string
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          app_store_link?: string | null
          created_at?: string
          hero_image?: string | null
          id?: string
          is_active?: boolean | null
          play_store_link?: string | null
          primary_button_link: string
          primary_button_text: string
          secondary_button_link: string
          secondary_button_text: string
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          app_store_link?: string | null
          created_at?: string
          hero_image?: string | null
          id?: string
          is_active?: boolean | null
          play_store_link?: string | null
          primary_button_link?: string
          primary_button_text?: string
          secondary_button_link?: string
          secondary_button_text?: string
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      login_history: {
        Row: {
          failure_reason: string | null
          id: string
          ip_address: string | null
          location: string | null
          login_timestamp: string
          success: boolean
          user_agent: string | null
          user_id: string
        }
        Insert: {
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          login_timestamp?: string
          success: boolean
          user_agent?: string | null
          user_id: string
        }
        Update: {
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          login_timestamp?: string
          success?: boolean
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "login_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mobile_money_providers: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          provider: Database["public"]["Enums"]["mobile_money_provider"]
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          provider: Database["public"]["Enums"]["mobile_money_provider"]
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          provider?: Database["public"]["Enums"]["mobile_money_provider"]
          updated_at?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          app_id: string
          created_at: string
          id: string
          rest_key: string
          updated_at: string
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          rest_key: string
          updated_at?: string
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          rest_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_subscriptions: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          notification_type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          created_at: string
          id: string
          message_template: string
          title_template: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_template: string
          title_template: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message_template?: string
          title_template?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          external_link: string | null
          id: string
          image_url: string | null
          message: string
          post_type: string | null
          recurring_schedule: Json | null
          schedule_type: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          target_audience: Json | null
          title: string
        }
        Insert: {
          created_at?: string
          external_link?: string | null
          id?: string
          image_url?: string | null
          message: string
          post_type?: string | null
          recurring_schedule?: Json | null
          schedule_type?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          target_audience?: Json | null
          title: string
        }
        Update: {
          created_at?: string
          external_link?: string | null
          id?: string
          image_url?: string | null
          message?: string
          post_type?: string | null
          recurring_schedule?: Json | null
          schedule_type?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          target_audience?: Json | null
          title?: string
        }
        Relationships: []
      }
      order_history: {
        Row: {
          created_at: string
          created_by: string
          id: string
          notes: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          book_id: string
          created_at: string
          discount_amount: number | null
          encryption_key: string | null
          id: string
          last_read: string | null
          order_id: string
          price_at_time: number
          quantity: number
        }
        Insert: {
          book_id: string
          created_at?: string
          discount_amount?: number | null
          encryption_key?: string | null
          id?: string
          last_read?: string | null
          order_id: string
          price_at_time: number
          quantity?: number
        }
        Update: {
          book_id?: string
          created_at?: string
          discount_amount?: number | null
          encryption_key?: string | null
          id?: string
          last_read?: string | null
          order_id?: string
          price_at_time?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          device_id: string | null
          id: string
          last_accessed: string | null
          notes: string | null
          payment_method: string | null
          payment_status: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: string
          last_accessed?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: string
          last_accessed?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          order_index: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          order_index?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          order_index?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_gateways: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          gateway_id: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          gateway_id?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          gateway_id?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_gateway_id_fkey"
            columns: ["gateway_id"]
            isOneToOne: false
            referencedRelation: "payment_gateways"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          location: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          location?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          location?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      publishers: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          photo: string | null
          postcode: string | null
          social_media_url: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          photo?: string | null
          postcode?: string | null
          social_media_url?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          photo?: string | null
          postcode?: string | null
          social_media_url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reading_list_books: {
        Row: {
          added_at: string | null
          book_id: string
          reading_list_id: string
        }
        Insert: {
          added_at?: string | null
          book_id: string
          reading_list_id: string
        }
        Update: {
          added_at?: string | null
          book_id?: string
          reading_list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_list_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_list_books_reading_list_id_fkey"
            columns: ["reading_list_id"]
            isOneToOne: false
            referencedRelation: "reading_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_lists: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_progress: {
        Row: {
          book_id: string | null
          completion_percentage: number | null
          created_at: string | null
          current_page: number | null
          id: string
          last_read_at: string | null
          total_pages: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_page?: number | null
          id?: string
          last_read_at?: string | null
          total_pages?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          current_page?: number | null
          id?: string
          last_read_at?: string | null
          total_pages?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_agents: {
        Row: {
          commission_rate: number
          created_at: string
          manager_id: string | null
          total_commission: number | null
          total_sales: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          manager_id?: string | null
          total_commission?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          manager_id?: string | null
          total_commission?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_agents_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_analytics: {
        Row: {
          created_at: string
          date: string
          id: string
          total_orders: number
          total_revenue: number
          total_sales: number
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          total_orders?: number
          total_revenue?: number
          total_sales?: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          total_orders?: number
          total_revenue?: number
          total_sales?: number
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          last_run: string | null
          name: string
          next_run: string | null
          recipients: Json | null
          schedule: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          name: string
          next_run?: string | null
          recipients?: Json | null
          schedule: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          name?: string
          next_run?: string | null
          recipients?: Json | null
          schedule?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      series: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image: string | null
          language_id: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          language_id?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          language_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          duration: number
          duration_unit: Database["public"]["Enums"]["subscription_duration"]
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: number
          duration_unit: Database["public"]["Enums"]["subscription_duration"]
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number
          duration_unit?: Database["public"]["Enums"]["subscription_duration"]
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          message: string
          sender_id: string
          ticket_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          message: string
          sender_id: string
          ticket_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          id: string
          settings: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string | null
          new_book_alerts: boolean | null
          order_updates: boolean | null
          price_drop_alerts: boolean | null
          reading_reminders: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          new_book_alerts?: boolean | null
          order_updates?: boolean | null
          price_drop_alerts?: boolean | null
          reading_reminders?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          new_book_alerts?: boolean | null
          order_updates?: boolean | null
          price_drop_alerts?: boolean | null
          reading_reminders?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          marketing_emails: boolean | null
          push_notifications: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voucher_books: {
        Row: {
          book_id: string
          voucher_id: string
        }
        Insert: {
          book_id: string
          voucher_id: string
        }
        Update: {
          book_id?: string
          voucher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voucher_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_books_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      voucher_series: {
        Row: {
          series_id: string
          voucher_id: string
        }
        Insert: {
          series_id: string
          voucher_id: string
        }
        Update: {
          series_id?: string
          voucher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voucher_series_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_series_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      voucher_tags: {
        Row: {
          tag_id: string
          voucher_id: string
        }
        Insert: {
          tag_id: string
          voucher_id: string
        }
        Update: {
          tag_id?: string
          voucher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voucher_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voucher_tags_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      vouchers: {
        Row: {
          client_id: string
          code: string
          commission_paid: boolean | null
          commission_rate: number
          created_at: string
          created_by: string
          id: string
          number_of_downloads: number
          payment_received: boolean | null
          redeemed: boolean | null
          redeemed_at: string | null
          total_amount: number
          type: Database["public"]["Enums"]["voucher_type"]
          updated_at: string
        }
        Insert: {
          client_id: string
          code: string
          commission_paid?: boolean | null
          commission_rate?: number
          created_at?: string
          created_by: string
          id?: string
          number_of_downloads?: number
          payment_received?: boolean | null
          redeemed?: boolean | null
          redeemed_at?: string | null
          total_amount: number
          type: Database["public"]["Enums"]["voucher_type"]
          updated_at?: string
        }
        Update: {
          client_id?: string
          code?: string
          commission_paid?: boolean | null
          commission_rate?: number
          created_at?: string
          created_by?: string
          id?: string
          number_of_downloads?: number
          payment_received?: boolean | null
          redeemed?: boolean | null
          redeemed_at?: string | null
          total_amount?: number
          type?: Database["public"]["Enums"]["voucher_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_device_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          device_type: string
          count: number
        }[]
      }
      get_voucher_type_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          type: string
          count: number
        }[]
      }
    }
    Enums: {
      ad_placement: "home" | "category" | "checkout" | "series" | "book"
      ad_type: "banner" | "interstitial" | "popup" | "sponsored"
      ad_type_status: "active" | "inactive"
      discount_strategy_type: "percentage" | "fixed" | "volume"
      discount_type: "percentage" | "fixed" | "volume" | "cart"
      mobile_money_provider: "mtn" | "orange"
      notification_type:
        | "new_book"
        | "new_promotion"
        | "new_discount"
        | "new_feature"
        | "system_update"
      subscription_duration: "day" | "week" | "month" | "year"
      voucher_type:
        | "single_book"
        | "series"
        | "all_books"
        | "multiple_books"
        | "book_tag"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
