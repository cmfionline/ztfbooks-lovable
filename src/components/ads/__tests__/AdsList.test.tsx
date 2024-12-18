import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdsList } from '../AdsList';

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
      is_active: false
    }
  ];

  const mockOnDeleteAd = vi.fn();

  it('renders ads in grid view', () => {
    render(<AdsList ads={mockAds} viewMode="grid" onDeleteAd={mockOnDeleteAd} />);
    
    expect(screen.getByText('Test Ad 1')).toBeInTheDocument();
    expect(screen.getByText('Test Ad 2')).toBeInTheDocument();
  });

  it('renders ads in list view', () => {
    render(<AdsList ads={mockAds} viewMode="list" onDeleteAd={mockOnDeleteAd} />);
    
    expect(screen.getByText('Test Ad 1')).toBeInTheDocument();
    expect(screen.getByText('Test Ad 2')).toBeInTheDocument();
  });

  it('displays no ads message when list is empty', () => {
    render(<AdsList ads={[]} viewMode="grid" onDeleteAd={mockOnDeleteAd} />);
    
    expect(screen.getByText('No advertisements found')).toBeInTheDocument();
  });

  it('calls onDeleteAd when delete button is clicked', () => {
    render(<AdsList ads={mockAds} viewMode="grid" onDeleteAd={mockOnDeleteAd} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    expect(mockOnDeleteAd).toHaveBeenCalledWith('1');
  });

  it('shows expiring soon badge for ads with expiring discounts', () => {
    const adsWithExpiringDiscount = [{
      ...mockAds[0],
      discount_type: 'percentage',
      discount_end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
    }];

    render(<AdsList ads={adsWithExpiringDiscount} viewMode="grid" onDeleteAd={mockOnDeleteAd} />);
    
    expect(screen.getByText('Expires Soon')).toBeInTheDocument();
  });
});