import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StripeSettings from '@/pages/payments/stripe';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
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

describe('Stripe Settings Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should load Stripe settings and display all components', async () => {
    renderWithProviders(<StripeSettings />);
    
    await waitFor(() => {
      expect(screen.getByText('Stripe Settings')).toBeInTheDocument();
      expect(screen.getByText('API Configuration')).toBeInTheDocument();
      expect(screen.getByText('Test Payment')).toBeInTheDocument();
    });
  });

  it('should handle API key updates', async () => {
    renderWithProviders(<StripeSettings />);
    
    const secretKeyInput = await screen.findByLabelText('Secret Key');
    fireEvent.change(secretKeyInput, { target: { value: 'new_test_key' } });
    
    const saveButton = screen.getByText('Save API Keys');
    fireEvent.click(saveButton);
    
    expect(supabase.functions.invoke).toHaveBeenCalledWith('update-stripe-keys', {
      body: { secretKey: 'new_test_key' }
    });
  });

  it('should handle test payment initiation', async () => {
    renderWithProviders(<StripeSettings />);
    
    const testPaymentButton = await screen.findByText(/Process Test Payment/);
    fireEvent.click(testPaymentButton);
    
    expect(supabase.functions.invoke).toHaveBeenCalledWith('stripe-checkout', {
      body: expect.any(Object)
    });
  });

  it('should handle gateway activation toggle', async () => {
    renderWithProviders(<StripeSettings />);
    
    const toggleButton = await screen.findByRole('switch');
    fireEvent.click(toggleButton);
    
    expect(supabase.from).toHaveBeenCalledWith('payment_gateways');
  });

  it('should display error toast on API failure', async () => {
    vi.mocked(supabase.functions.invoke).mockRejectedValueOnce(new Error('API Error'));
    
    renderWithProviders(<StripeSettings />);
    
    const testPaymentButton = await screen.findByText(/Process Test Payment/);
    fireEvent.click(testPaymentButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });
});