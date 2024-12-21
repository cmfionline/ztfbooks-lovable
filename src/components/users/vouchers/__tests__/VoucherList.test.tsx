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
      redeemed_at: null,
      commission_rate: 10,
      commission_paid: false,
      total_amount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      number_of_downloads: 1,
      status: 'active',
    },
  ];

  it('renders vouchers correctly', () => {
    render(
      <VoucherList
        vouchers={mockVouchers}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        selectedVouchers={[]}
        onSelectionChange={() => {}}
      />
    );

    expect(screen.getByText('TEST123')).toBeInTheDocument();
    expect(screen.getByText('Single Book')).toBeInTheDocument();
  });

  it('handles selection', () => {
    const mockOnSelectionChange = vi.fn();
    render(
      <VoucherList
        vouchers={mockVouchers}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        selectedVouchers={[]}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnSelectionChange).toHaveBeenCalledWith(['1']);
  });

  it('displays empty state when no vouchers', () => {
    render(
      <VoucherList
        vouchers={[]}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        selectedVouchers={[]}
        onSelectionChange={() => {}}
      />
    );

    expect(screen.getByText('No vouchers found for this client')).toBeInTheDocument();
  });
});