import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateVoucher from '../CreateVoucher';
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

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CreateVoucher', () => {
  it('renders the form correctly', () => {
    renderWithRouter(<CreateVoucher />);
    
    expect(screen.getByText('Create Voucher')).toBeInTheDocument();
    expect(screen.getByLabelText('Voucher Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Client Email')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    renderWithRouter(<CreateVoucher />);
    
    fireEvent.change(screen.getByLabelText('Client Email'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.click(screen.getByText('Create Voucher'));
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('vouchers');
    });
  });

  it('displays validation errors', async () => {
    renderWithRouter(<CreateVoucher />);
    
    fireEvent.click(screen.getByText('Create Voucher'));
    
    await waitFor(() => {
      expect(screen.getByText('Client email is required')).toBeInTheDocument();
    });
  });
});