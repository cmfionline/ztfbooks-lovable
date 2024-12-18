import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EbookTableRow } from '../EbookTableRow';
import { vi } from 'vitest';

const mockBook = {
  id: '1',
  title: 'Test Book',
  price: 9.99,
  is_featured: false,
  authors: { name: 'Test Author' },
  languages: { name: 'English' },
  publishers: { name: 'Test Publisher' },
  series: { name: 'Test Series' },
};

const mockProps = {
  book: mockBook,
  index: 0,
  onToggleTopSelling: vi.fn(),
  onToggleFeatured: vi.fn(),
  onDelete: vi.fn(),
};

describe('EbookTableRow', () => {
  const renderComponent = () => 
    render(
      <BrowserRouter>
        <table>
          <tbody>
            <EbookTableRow {...mockProps} />
          </tbody>
        </table>
      </BrowserRouter>
    );

  it('renders book title', () => {
    renderComponent();
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('renders book author', () => {
    renderComponent();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('renders correct price', () => {
    renderComponent();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('handles featured toggle', () => {
    renderComponent();
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    expect(mockProps.onToggleFeatured).toHaveBeenCalledWith('1', true);
  });

  it('handles delete', () => {
    renderComponent();
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('renders correct edit link', () => {
    renderComponent();
    const editLink = screen.getByRole('link');
    expect(editLink).toHaveAttribute('href', '/books/edit/1');
  });
});