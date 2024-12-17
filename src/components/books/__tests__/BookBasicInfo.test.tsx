import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookBasicInfo } from '../components/BookBasicInfo';
import { BrowserRouter } from 'react-router-dom';
import { createMockControl } from '@/test/form-helpers';

describe('BookBasicInfo', () => {
  const mockControl = createMockControl();

  const mockData = {
    series: [{ label: 'Test Series', value: '1' }],
    languages: [{ label: 'English', value: '1' }],
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
      <BookBasicInfo 
        control={mockControl} 
        series={mockData.series} 
        languages={mockData.languages} 
      />
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/series/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/synopsis/i)).toBeInTheDocument();
  });

  it('renders add buttons with correct links', () => {
    renderWithRouter(
      <BookBasicInfo 
        control={mockControl} 
        series={mockData.series} 
        languages={mockData.languages} 
      />
    );

    expect(screen.getByText(/add series/i).closest('a')).toHaveAttribute('href', '/books/series/add');
    expect(screen.getByText(/add language/i).closest('a')).toHaveAttribute('href', '/books/languages/add');
  });

  it('handles input changes', () => {
    renderWithRouter(
      <BookBasicInfo 
        control={mockControl} 
        series={mockData.series} 
        languages={mockData.languages} 
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Book' }
    });

    fireEvent.change(screen.getByLabelText(/synopsis/i), {
      target: { value: 'Test Synopsis' }
    });
  });
});