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
  authors: {
    name: string;
  };
}