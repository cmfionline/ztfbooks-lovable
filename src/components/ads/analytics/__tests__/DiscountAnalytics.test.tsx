import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DiscountAnalytics } from '../DiscountAnalytics';
import { useQuery } from '@tanstack/react-query';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn()
}));

describe('DiscountAnalytics', () => {
  const mockAnalytics = {
    redemption_count: 100,
    sales_impact: 1000,
    roi: 2.5
  };

  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockAnalytics,
      isLoading: false,
      error: null
    } as any);
  });

  it('renders analytics data', () => {
    render(<DiscountAnalytics adId="test-id" />);
    
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    } as any);

    render(<DiscountAnalytics adId="test-id" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays ROI chart', () => {
    render(<DiscountAnalytics adId="test-id" />);
    
    expect(screen.getByText('ROI Analysis')).toBeInTheDocument();
  });
});