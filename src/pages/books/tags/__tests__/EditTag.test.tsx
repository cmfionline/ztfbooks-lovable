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

// Create a complete mock implementation of PostgrestFilterBuilder
const createPostgrestMock = () => {
  const mockMethods = {
    eq: vi.fn(),
    neq: vi.fn(),
    gt: vi.fn(),
    gte: vi.fn(),
    lt: vi.fn(),
    lte: vi.fn(),
    like: vi.fn(),
    ilike: vi.fn(),
    is: vi.fn(),
    in: vi.fn(),
    contains: vi.fn(),
    containedBy: vi.fn(),
    rangeLt: vi.fn(),
    rangeGt: vi.fn(),
    rangeGte: vi.fn(),
    rangeLte: vi.fn(),
    rangeAdjacent: vi.fn(),
    overlaps: vi.fn(),
    textSearch: vi.fn(),
    match: vi.fn(),
    not: vi.fn(),
    filter: vi.fn(),
    or: vi.fn(),
    and: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    range: vi.fn(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    csv: vi.fn(),
    geojson: vi.fn(),
    explain: vi.fn(),
    throwOnError: vi.fn(),
    select: vi.fn(),
    insert: vi.fn(),
    upsert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    execute: vi.fn(),
  };

  // Make each method return the mock object for chaining
  Object.keys(mockMethods).forEach(key => {
    mockMethods[key].mockReturnValue(mockMethods);
  });

  // Add specific implementations for commonly used methods
  mockMethods.eq.mockImplementation(() => ({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: '1', name: 'Test Tag' }, error: null }),
    }),
    update: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      }),
    }),
  }));

  return mockMethods;
};

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => createPostgrestMock()),
      update: vi.fn(() => createPostgrestMock()),
    })),
  },
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

  it('validates required fields', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Tag')).toBeInTheDocument();
    });

    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: '' } });

    const submitButton = screen.getByText(/update tag/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => ({
            data: null,
            error: new Error('Failed to fetch tag'),
          })),
        })),
      })),
    }));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/error loading tag/i)).toBeInTheDocument();
    });
  });

  it('navigates back on cancel', async () => {
    const navigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ id: 'test-id' }),
        useNavigate: () => navigate,
      };
    });

    renderComponent();

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(navigate).toHaveBeenCalledWith('/books/tags');
  });
});