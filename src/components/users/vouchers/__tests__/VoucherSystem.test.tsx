import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VoucherManagement from '../VoucherManagement';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            code: 'TEST123',
            type: 'single_book',
            client_id: 'client1',
            status: 'active',
            total_amount: 29.99,
            redeemed: false,
            books: [{ book: { title: 'Test Book' } }]
          }
        ],
        count: 1,
        error: null
      })
    }))
  }
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Voucher System Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('loads and displays vouchers correctly', async () => {
    renderWithProviders(<VoucherManagement clientId="client1" />);
    
    await waitFor(() => {
      expect(screen.getByText('TEST123')).toBeInTheDocument();
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    renderWithProviders(<VoucherManagement clientId="client1" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Failed to fetch vouchers')
      })
    }));

    renderWithProviders(<VoucherManagement clientId="client1" />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});