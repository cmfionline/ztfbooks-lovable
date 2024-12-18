import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import DevicesPage from '../../../pages/orders/devices';

// Mock the hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: []
  }))
}));

describe('DevicesPage', () => {
  const mockDevices = [
    {
      id: '1',
      device_name: 'Test Device 1',
      last_active: '2024-01-01',
      is_active: true
    },
    {
      id: '2',
      device_name: 'Test Device 2',
      last_active: '2024-01-02',
      is_active: false
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockReturnValue({
      data: mockDevices,
      isLoading: false,
      error: null,
      refetch: vi.fn()
    } as any);
  });

  it('renders devices table', () => {
    render(<DevicesPage />);
    
    expect(screen.getByText('Test Device 1')).toBeInTheDocument();
    expect(screen.getByText('Test Device 2')).toBeInTheDocument();
  });

  it('handles search input', () => {
    render(<DevicesPage />);
    
    const searchInput = screen.getByPlaceholderText(/search devices/i);
    fireEvent.change(searchInput, { target: { value: 'Test Device 1' } });
    
    expect(screen.getByText('Test Device 1')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    } as any);

    render(<DevicesPage />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch devices')
    } as any);

    render(<DevicesPage />);
    
    expect(screen.getByText(/failed to fetch devices/i)).toBeInTheDocument();
  });
});