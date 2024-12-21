import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VouchersList from '../VouchersList';

// Mock the entire supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        order: () => ({
          limit: () => Promise.resolve({
            data: [
              {
                id: '1',
                code: 'TEST123',
                type: 'single_book',
                created_at: new Date().toISOString(),
                client: { full_name: 'Test Client' },
                books: [{ book: { title: 'Test Book' } }],
                redeemed: false
              }
            ],
            error: null
          })
        })
      })
    })
  }
}));

describe('VouchersList', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders vouchers list correctly', async () => {
    renderWithRouter(<VouchersList />);
    
    await waitFor(() => {
      expect(screen.getByText('TEST123')).toBeInTheDocument();
      expect(screen.getByText('Test Client')).toBeInTheDocument();
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    renderWithRouter(<VouchersList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});