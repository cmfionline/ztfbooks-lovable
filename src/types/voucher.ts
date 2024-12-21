export interface Voucher {
  id: string;
  code: string;
  type: 'single_book' | 'multiple_books' | 'series' | 'book_tag' | 'all_books';
  created_by: string;
  client_id: string;
  payment_received: boolean;
  redeemed: boolean;
  redeemed_at: string | null;
  commission_rate: number;
  commission_paid: boolean;
  total_amount: number;
  created_at: string;
  updated_at: string;
  number_of_downloads: number;
  status: 'active' | 'inactive';
}