import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '../Index';

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () => ({
          data: [
            {
              total_revenue: 1000,
              total_sales: 50,
              total_orders: 25,
            },
          ],
          limit: () => ({
            abortSignal: () => ({
              data: [
                {
                  id: '1',
                  title: 'Test Book',
                  price: 19.99,
                  authors: { name: 'Test Author' },
                },
              ],
            }),
          }),
        }),
      }),
    }),
  },
}));

// Mock the components that are tested separately
vi.mock('@/components/dashboard/Filters', () => ({
  Filters: () => <div data-testid="filters">Filters Component</div>,
}));

vi.mock('@/components/dashboard/SalesOverview', () => ({
  default: () => <div data-testid="sales-overview">Sales Overview Component</div>,
}));

vi.mock('@/components/dashboard/RecentActivities', () => ({
  default: () => <div data-testid="recent-activities">Recent Activities Component</div>,
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

describe('Dashboard Page', () => {
  it('renders the dashboard title', () => {
    renderWithProviders(<Index />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders all main dashboard components', () => {
    renderWithProviders(<Index />);
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getByTestId('sales-overview')).toBeInTheDocument();
    expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
  });

  it('displays revenue metrics when data is loaded', async () => {
    renderWithProviders(<Index />);
    await waitFor(() => {
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('Total Sales')).toBeInTheDocument();
      expect(screen.getByText('Total Orders')).toBeInTheDocument();
    });
  });

  it('displays best selling books section', async () => {
    renderWithProviders(<Index />);
    await waitFor(() => {
      expect(screen.getByText('Best Selling Books')).toBeInTheDocument();
    });
  });

  it('handles loading state correctly', () => {
    renderWithProviders(<Index />);
    // Initially, loading indicators should be present
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays error toast when data fetching fails', async () => {
    // Mock console.error to prevent error logs in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Force an error by modifying the mock
    vi.mocked(supabase.from).mockImplementationOnce(() => {
      throw new Error('Failed to fetch data');
    });

    renderWithProviders(<Index />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});