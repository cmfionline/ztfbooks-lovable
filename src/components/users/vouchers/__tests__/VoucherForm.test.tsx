import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VoucherForm } from '../components/VoucherForm';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
  },
}));

describe('VoucherForm', () => {
  const mockOnSuccess = vi.fn();

  it('renders form fields correctly', () => {
    render(<VoucherForm clientId="test-client" onSuccess={mockOnSuccess} />);
    
    expect(screen.getByText('Voucher Type')).toBeInTheDocument();
    expect(screen.getByText('Client Name')).toBeInTheDocument();
    expect(screen.getByText('Client Email')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    render(<VoucherForm clientId="test-client" onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByLabelText('Client Name'), {
      target: { value: 'Test Client' },
    });
    
    fireEvent.change(screen.getByLabelText('Client Email'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '100' },
    });
    
    fireEvent.click(screen.getByText('Create Voucher'));
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('vouchers');
    });
  });

  it('displays validation errors', async () => {
    render(<VoucherForm clientId="test-client" onSuccess={mockOnSuccess} />);
    
    fireEvent.click(screen.getByText('Create Voucher'));
    
    await waitFor(() => {
      expect(screen.getByText('Client name is required')).toBeInTheDocument();
      expect(screen.getByText('Amount is required')).toBeInTheDocument();
    });
  });
});