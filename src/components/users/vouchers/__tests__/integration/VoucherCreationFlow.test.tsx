import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VoucherManagement from '../../VoucherManagement';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn(),
      single: vi.fn(),
      url: new URL('http://localhost'),
      headers: {},
      upsert: vi.fn(),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
  },
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

describe('Voucher Creation Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('completes the full voucher creation flow', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: {
        id: 'new-voucher-id',
        code: 'TEST123',
        type: 'single_book',
      },
      error: null,
    });

    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: mockInsert,
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      url: new URL('http://localhost'),
      headers: {},
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }));

    renderWithProviders(<VoucherManagement clientId="test-client" />);

    // Click create button
    fireEvent.click(screen.getByText('Create Voucher'));
    expect(screen.getByText('Voucher Type')).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByLabelText('Number of Downloads'), {
      target: { value: '1' },
    });

    // Submit form
    fireEvent.click(screen.getByText('Create Voucher'));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  it('handles errors in the creation flow', async () => {
    const mockError = new Error('Failed to create voucher');
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockRejectedValue(mockError),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      url: new URL('http://localhost'),
      headers: {},
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }));

    renderWithProviders(<VoucherManagement clientId="test-client" />);

    // Click create button
    fireEvent.click(screen.getByText('Create Voucher'));

    // Fill form
    fireEvent.change(screen.getByLabelText('Number of Downloads'), {
      target: { value: '1' },
    });

    // Submit form
    fireEvent.click(screen.getByText('Create Voucher'));

    await waitFor(() => {
      expect(screen.getByText(/Failed to create voucher/i)).toBeInTheDocument();
    });
  });
});