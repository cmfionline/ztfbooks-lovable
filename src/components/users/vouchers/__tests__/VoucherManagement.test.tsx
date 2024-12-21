import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VoucherManagement from '../VoucherManagement';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
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

describe('VoucherManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('renders the component with create button', () => {
    renderWithProviders(<VoucherManagement clientId="test-client" />);
    expect(screen.getByText('Create Voucher')).toBeInTheDocument();
  });

  it('shows form when create button is clicked', async () => {
    renderWithProviders(<VoucherManagement clientId="test-client" />);
    fireEvent.click(screen.getByText('Create Voucher'));
    expect(screen.getByText('Voucher Type')).toBeInTheDocument();
  });

  it('creates demo vouchers when no vouchers exist', async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });

    vi.mocked(supabase.from).mockImplementation(() => ({
      select: mockSelect,
      insert: mockInsert,
      delete: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      url: new URL('http://localhost'),
      headers: {},
      upsert: vi.fn(),
      single: vi.fn(),
    }));

    renderWithProviders(<VoucherManagement clientId="test-client" />);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  it('handles voucher deletion', async () => {
    const mockDelete = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.from).mockImplementation(() => ({
      delete: mockDelete,
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      url: new URL('http://localhost'),
      headers: {},
      upsert: vi.fn(),
      single: vi.fn(),
    }));

    renderWithProviders(<VoucherManagement clientId="test-client" />);
    
    // Simulate delete action
    const deleteButtons = await screen.findAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);
    
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
    });
  });
});