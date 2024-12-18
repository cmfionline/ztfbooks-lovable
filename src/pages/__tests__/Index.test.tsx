import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '../Index';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

// Mock the modules
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      abortSignal: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          total_revenue: 1000,
          total_sales: 50,
          total_orders: 25,
        },
        error: null,
      }),
    })),
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays error toast when data fetching fails', async () => {
    const mockToast = vi.fn();
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    vi.mocked(supabase.from).mockImplementation(() => {
      throw new Error('Failed to fetch data');
    });

    renderWithProviders(<Index />);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Error",
        description: "There was a problem loading the dashboard. Please try again.",
      });
    });
  });
});