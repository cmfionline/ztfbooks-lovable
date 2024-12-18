import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import OrderDetailsPage from '../../../pages/orders/[id]';

// Mock the hooks
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

describe('OrderDetailsPage', () => {
  const mockOrder = {
    id: '123',
    status: 'pending',
    payment_status: 'pending',
    created_at: '2024-03-01T00:00:00Z',
    profiles: { full_name: 'John Doe' },
    order_items: [
      {
        id: '1',
        book: { title: 'Test Book', cover_image: 'test.jpg' },
        price_at_time: 9.99,
      },
    ],
    order_history: [
      {
        id: '1',
        status: 'pending',
        created_at: '2024-03-01T00:00:00Z',
        notes: 'Initial order',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as any).mockReturnValue({ id: '123' });
    (useNavigate as any).mockReturnValue(vi.fn());
    (useQueryClient as any).mockReturnValue({
      invalidateQueries: vi.fn(),
    });
    (useQuery as any).mockReturnValue({
      data: mockOrder,
      isLoading: false,
    });
    (useMutation as any).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it('renders loading state', () => {
    (useQuery as any).mockReturnValue({
      isLoading: true,
    });

    render(<OrderDetailsPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders order details', () => {
    render(<OrderDetailsPage />);

    expect(screen.getByText(/Order #123/)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('handles status change', async () => {
    const mockMutateAsync = vi.fn();
    (useMutation as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    render(<OrderDetailsPage />);

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });

  it('displays error toast on mutation error', async () => {
    const mockToast = vi.fn();
    vi.mocked(useToast).mockReturnValue({ toast: mockToast });

    const mockMutateAsync = vi.fn().mockRejectedValue(new Error('Test error'));
    (useMutation as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    render(<OrderDetailsPage />);

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        title: 'Error updating order',
        description: expect.any(String),
      });
    });
  });
});