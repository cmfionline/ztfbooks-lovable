import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookMetadata } from '../components/BookMetadata';
import { BrowserRouter } from 'react-router-dom';
import { createMockControl } from '@/test/form-helpers';

describe('BookMetadata', () => {
  const mockControl = createMockControl({ isFree: false });

  const mockData = {
    authors: [{ label: 'Test Author', value: '1' }],
    publishers: [{ label: 'Test Publisher', value: '1' }],
  };

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders all form fields', () => {
    renderWithRouter(
      <BookMetadata 
        control={mockControl} 
        authors={mockData.authors} 
        publishers={mockData.publishers} 
      />
    );

    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publisher/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/publication date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pricing/i)).toBeInTheDocument();
  });

  it('renders add buttons with correct links', () => {
    renderWithRouter(
      <BookMetadata 
        control={mockControl} 
        authors={mockData.authors} 
        publishers={mockData.publishers} 
      />
    );

    expect(screen.getByText(/add author/i).closest('a')).toHaveAttribute('href', '/books/authors/add');
    expect(screen.getByText(/add publisher/i).closest('a')).toHaveAttribute('href', '/books/publishers/add');
  });

  it('handles pricing type selection', () => {
    renderWithRouter(
      <BookMetadata 
        control={mockControl} 
        authors={mockData.authors} 
        publishers={mockData.publishers} 
      />
    );

    const freeButton = screen.getByText(/free/i);
    const paidButton = screen.getByText(/paid/i);

    fireEvent.click(freeButton);
    fireEvent.click(paidButton);
  });

  it('shows price input when paid is selected', () => {
    const mockControlWithPaid = createMockControl({ isFree: false });
    renderWithRouter(
      <BookMetadata 
        control={mockControlWithPaid} 
        authors={mockData.authors} 
        publishers={mockData.publishers} 
      />
    );

    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
  });
});