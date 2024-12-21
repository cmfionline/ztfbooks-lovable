import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VouchersList from '../VouchersList';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            code: 'TEST123',
            type: 'single_book',
            created_at: new Date().toISOString(),
          },
        ],
        error: null,
      }),
    })),
  },
}));

describe('VouchersList', () => {
  it('renders vouchers list correctly', async () => {
    render(
      <BrowserRouter>
        <VouchersList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('TEST123')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    render(
      <BrowserRouter>
        <VouchersList />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles empty state', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    }));

    render(
      <BrowserRouter>
        <VouchersList />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('No vouchers found')).toBeInTheDocument();
    });
  });
});