import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VoucherForm } from '../components/VoucherForm';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn(),
      url: new URL('http://localhost'),
      headers: {},
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
  },
}));

describe('VoucherForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles form submission correctly', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
    vi.mocked(supabase.from).mockImplementation(() => ({
      insert: mockInsert,
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
      url: new URL('http://localhost'),
      headers: {},
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }));

    render(<VoucherForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText('Number of Downloads'), {
      target: { value: '1' },
    });

    fireEvent.click(screen.getByText('Create Voucher'));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('displays validation errors', async () => {
    render(<VoucherForm onSuccess={mockOnSuccess} />);
    
    fireEvent.click(screen.getByText('Create Voucher'));
    
    await waitFor(() => {
      expect(screen.getByText('Number of downloads is required')).toBeInTheDocument();
    });
  });
});