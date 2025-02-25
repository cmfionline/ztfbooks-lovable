import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EbookTableRow } from '../ebooks/components/EbookTableRow';
import { BrowserRouter } from 'react-router-dom';
import type { Book } from '@/types/book';

describe('Book Discounts', () => {
  const mockBook: Book = {
    id: '1',
    title: 'Test Book',
    price: 100,
    discount_percentage: 20,
    discount_start_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    discount_end_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    is_featured: false,
    authors: { id: '1', name: 'Test Author' },
    languages: { name: 'English' },
    publishers: { id: '1', name: 'Test Publisher' },
    series: { id: '1', name: 'Test Series' },
    // Adding required Book properties
    language_id: '1',
    author_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const mockHandlers = {
    onToggleTopSelling: vi.fn(),
    onToggleFeatured: vi.fn(),
    onDelete: vi.fn()
  };

  it('displays correct discounted price when discount is active', () => {
    render(
      <BrowserRouter>
        <table>
          <tbody>
            <EbookTableRow
              book={mockBook}
              index={0}
              {...mockHandlers}
            />
          </tbody>
        </table>
      </BrowserRouter>
    );

    // Original price should be displayed and struck through
    expect(screen.getByText('$100.00')).toHaveClass('line-through');
    
    // Discounted price should be displayed (100 - 20% = 80)
    expect(screen.getByText('$80.00')).toBeInTheDocument();
    
    // Discount percentage should be displayed
    expect(screen.getByText('(-20%)')).toBeInTheDocument();
  });

  it('does not display discount when dates are invalid', () => {
    const bookWithExpiredDiscount: Book = {
      ...mockBook,
      discount_start_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      discount_end_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    };

    render(
      <BrowserRouter>
        <table>
          <tbody>
            <EbookTableRow
              book={bookWithExpiredDiscount}
              index={0}
              {...mockHandlers}
            />
          </tbody>
        </table>
      </BrowserRouter>
    );

    // Only original price should be displayed
    expect(screen.getByText('$100.00')).not.toHaveClass('line-through');
    expect(screen.queryByText('$80.00')).not.toBeInTheDocument();
    expect(screen.queryByText('(-20%)')).not.toBeInTheDocument();
  });
});