import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Payments from '@/pages/payments';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '1',
          type: 'stripe',
          is_active: true,
          config: { secret_key: 'test_key' }
        },
        error: null
      })
    })),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { url: 'https://checkout.stripe.com' }, error: null })
    }
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
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Payment Gateways Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should load and display payment gateway settings', async () => {
    renderWithProviders(<Payments />);
    
    await waitFor(() => {
      expect(screen.getByText('Payment Gateways')).toBeInTheDocument();
      expect(screen.getByText('Stripe')).toBeInTheDocument();
      expect(screen.getByText('PayStack')).toBeInTheDocument();
    });
  });

  it('should handle gateway activation toggle', async () => {
    renderWithProviders(<Payments />);
    
    const toggleButton = await screen.findByRole('switch');
    fireEvent.click(toggleButton);
    
    expect(supabase.from).toHaveBeenCalledWith('payment_gateways');
  });
});