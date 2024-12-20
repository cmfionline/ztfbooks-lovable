export interface Book {
  id: string;
  title: string;
  series_id?: string;
  language_id: string;
  cover_image?: string;
  synopsis?: string;
  author_id: string;
  publisher_id?: string;
  epub_file?: string;
  publication_date?: string;
  page_count?: number;
  is_free?: boolean;
  price?: number;
  created_at: string;
  updated_at: string;
  is_featured?: boolean;
  is_top_selling?: boolean;
  discount_percentage?: number;
  discount_start_date?: string;
  discount_end_date?: string;
  is_featured_discount?: boolean;
  authors: {
    id: string;
    name: string;
  };
  series?: {
    id: string;
    name: string;
  };
  languages: {
    name: string;
    code?: string;
  };
  publishers?: {
    id: string;
    name: string;
  };
  books_tags?: {
    tag_id: string;
    tags: {
      id: string;
      name: string;
    };
  }[];
}

export interface Activity {
  id: string;
  activity_type: 'purchase' | 'review' | 'download' | 'read';
  created_at: string;
  books: {
    title: string;
  }[];
  metadata?: Record<string, any>;
}

export interface SalesData {
  date: string;
  total_sales: number;
  total_revenue: number;
  total_orders: number;
}