import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookTags } from '../components/BookTags';
import { BrowserRouter } from 'react-router-dom';

describe('BookTags', () => {
  const mockTags = [
    { label: 'Fiction', value: '1' },
    { label: 'Fantasy', value: '2' },
    { label: 'Adventure', value: '3' },
  ];

  const mockSelectedTags = ['1'];
  const mockSetSelectedTags = vi.fn();

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders selected tags', () => {
    renderWithRouter(
      <BookTags 
        selectedTags={mockSelectedTags}
        setSelectedTags={mockSetSelectedTags}
        tags={mockTags}
      />
    );

    expect(screen.getByText('Fiction')).toBeInTheDocument();
  });

  it('renders add tag button with correct link', () => {
    renderWithRouter(
      <BookTags 
        selectedTags={mockSelectedTags}
        setSelectedTags={mockSetSelectedTags}
        tags={mockTags}
      />
    );

    expect(screen.getByText(/add tag/i).closest('a'))
      .toHaveAttribute('href', '/books/tags/add');
  });

  it('handles tag removal', () => {
    renderWithRouter(
      <BookTags 
        selectedTags={mockSelectedTags}
        setSelectedTags={mockSetSelectedTags}
        tags={mockTags}
      />
    );

    fireEvent.click(screen.getByText('×'));
    expect(mockSetSelectedTags).toHaveBeenCalledWith([]);
  });

  it('handles tag selection', () => {
    renderWithRouter(
      <BookTags 
        selectedTags={[]}
        setSelectedTags={mockSetSelectedTags}
        tags={mockTags}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });
  });
});