import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditTag from '../EditTag';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

// Mock the hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'test-id' }),
    useNavigate: () => vi.fn(),
  };
});

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => ({
            data: { id: '1', name: 'Test Tag' },
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: '1', name: 'Updated Tag' },
              error: null
            }))
          }))
        }))
      }))
    }))
  }
}));

describe('EditTag', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <EditTag />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('loads and displays tag data', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Tag')).toBeInTheDocument();
    });
  });

  it('handles form submission successfully', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Tag')).toBeInTheDocument();
    });

    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: 'Updated Tag' } });

    const submitButton = screen.getByText(/update tag/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({
        title: "Success",
        description: "Tag has been updated successfully",
      });
    });
  });
});