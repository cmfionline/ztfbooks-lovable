import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VoucherList } from '../components/VoucherList';
import type { Voucher } from '../types';

describe('VoucherList', () => {
  const mockVouchers: Voucher[] = [
    {
      id: '1',
      code: 'TEST123',
      type: 'single_book',
      created_by: 'user1',
      client_id: 'client1',
      payment_received: false,
      redeemed: false,
      commission_rate: 10,
      commission_paid: false,
      total_amount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      number_of_downloads: 1,
      status: 'active',
      books: [],
      series: [],
      tags: [],
    },
  ];

  const mockOnToggleStatus = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders vouchers correctly', () => {
    render(
      <VoucherList
        vouchers={mockVouchers}
        onToggleStatus={mockOnToggleStatus}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('TEST123')).toBeInTheDocument();
    expect(screen.getByText('Single Book')).toBeInTheDocument();
  });

  it('handles status toggle', () => {
    render(
      <VoucherList
        vouchers={mockVouchers}
        onToggleStatus={mockOnToggleStatus}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByTitle('Deactivate'));
    expect(mockOnToggleStatus).toHaveBeenCalledWith(mockVouchers[0]);
  });

  it('handles delete action', () => {
    render(
      <VoucherList
        vouchers={mockVouchers}
        onToggleStatus={mockOnToggleStatus}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByTitle('Delete'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockVouchers[0]);
  });

  it('displays empty state when no vouchers', () => {
    render(
      <VoucherList
        vouchers={[]}
        onToggleStatus={mockOnToggleStatus}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No vouchers found')).toBeInTheDocument();
  });
});