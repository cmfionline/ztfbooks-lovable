import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import OrderDetailsPage from '../../../pages/orders/[id]';

// Mock the hooks
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn()
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn()
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: []
  }))
}));

describe('OrderDetailsPage', () => {
  const mockOrder = {
    id: '123',
    status: 'pending',
    total_amount: 100,
    created_at: '2024-01-01',
    items: [
      {
        id: '1',
        book_id: 'book1',
        quantity: 1,
        price_at_time: 50
      }
    ]
  };

  const mockQueryClient = {
    invalidateQueries: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ id: '123' });
    vi.mocked(useNavigate).mockReturnValue(vi.fn());
    vi.mocked(useQuery).mockReturnValue({
      data: mockOrder,
      isLoading: false,
      error: null
    } as any);
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false
    } as any);
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient as any);
  });

  it('renders order details', () => {
    render(<OrderDetailsPage />);
    
    expect(screen.getByText(/order #123/i)).toBeInTheDocument();
    expect(screen.getByText(/\$100/)).toBeInTheDocument();
  });

  it('handles status update', async () => {
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isLoading: false
    } as any);

    render(<OrderDetailsPage />);
    
    const statusSelect = screen.getByLabelText(/status/i);
    fireEvent.change(statusSelect, { target: { value: 'completed' } });
    
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: '123',
        status: 'completed'
      });
    });
  });

  it('shows loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    } as any);

    render(<OrderDetailsPage />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch order')
    } as any);

    render(<OrderDetailsPage />);
    
    expect(screen.getByText(/failed to fetch order/i)).toBeInTheDocument();
  });
});