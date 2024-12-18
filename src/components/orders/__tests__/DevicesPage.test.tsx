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
  })),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      then: vi.fn(),
    })),
  },
}));

describe('DevicesPage', () => {
  const mockDevices = [
    {
      id: '1',
      device_id: 'device_123',
      profiles: { full_name: 'John Doe' },
      device_name: 'iPhone 12',
      is_active: true,
      last_active: '2024-03-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useQuery as any).mockReturnValue({
      data: mockDevices,
      isLoading: false,
    });
  });

  it('renders devices table', () => {
    render(<DevicesPage />);

    expect(screen.getByText('Device Management')).toBeInTheDocument();
    expect(screen.getByText('device_123')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('iPhone 12')).toBeInTheDocument();
  });

  it('handles search input', () => {
    render(<DevicesPage />);

    const searchInput = screen.getByPlaceholderText('Search devices...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(searchInput).toHaveValue('John');
  });

  it('handles device status toggle', async () => {
    const mockToast = vi.fn();
    vi.mocked(useToast).mockReturnValue({ toast: mockToast });

    render(<DevicesPage />);

    const toggleButton = screen.getByText('Deactivate');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Device status updated',
        description: expect.any(String),
      });
    });
  });

  it('displays loading state', () => {
    (useQuery as any).mockReturnValue({
      isLoading: true,
    });

    render(<DevicesPage />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('handles empty devices list', () => {
    (useQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<DevicesPage />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});