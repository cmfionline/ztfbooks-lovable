import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdsList } from '../AdsList';
import { BrowserRouter } from 'react-router-dom';

describe('AdsList', () => {
  const mockAds = [
    {
      id: '1',
      name: 'Test Ad 1',
      type: 'banner',
      placement: 'home',
      content: 'Test content 1',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      is_active: true
    },
    {
      id: '2',
      name: 'Test Ad 2',
      type: 'popup',
      placement: 'category',
      content: 'Test content 2',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      is_active: false,
      discount_type: 'percentage',
      discount_value: 10,
      discount_end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockOnDeleteAd = vi.fn();

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders ads in grid view', () => {
    renderWithRouter(<AdsList ads={mockAds} viewMode="grid" onDeleteAd={mockOnDeleteAd} />);
    
    expect(screen.getByText('Test Ad 1')).toBeInTheDocument();
    expect(screen.getByText('Test Ad 2')).toBeInTheDocument();
  });

  it('renders ads in list view', () => {
    renderWithRouter(<AdsList ads={mockAds} viewMode="list" onDeleteAd={mockOnDeleteAd} />);
    
    expect(screen.getByText('Test Ad 1')).toBeInTheDocument();
    expect(screen.getByText('Test Ad 2')).toBeInTheDocument();
  });

  it('displays no ads message when list is empty', () => {
    renderWithRouter(<AdsList ads={[]} viewMode="grid" onDeleteAd={mockOnDeleteAd} />);
    
    expect(screen.getByText('No advertisements found')).toBeInTheDocument();
  });

  it('calls onDeleteAd when delete button is clicked', () => {
    renderWithRouter(<AdsList ads={mockAds} viewMode="grid" onDeleteAd={mockOnDeleteAd} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    expect(mockOnDeleteAd).toHaveBeenCalledWith('1');
  });

  it('shows expiring soon badge for ads with expiring discounts', () => {
    renderWithRouter(<AdsList ads={mockAds} viewMode="grid" onDeleteAd={mockOnDeleteAd} />);
    
    expect(screen.getByText('Expires Soon')).toBeInTheDocument();
  });

  it('displays correct discount information', () => {
    renderWithRouter(<AdsList ads={mockAds} viewMode="grid" onDeleteAd={mockOnDeleteAd} />);
    
    expect(screen.getByText('Discount: 10%')).toBeInTheDocument();
  });
});