import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DiscountPerformance } from '../DiscountPerformance';

describe('DiscountPerformance', () => {
  const mockData = [
    { ad_id: '1', redemption_count: 100, sales_impact: 1000 },
    { ad_id: '2', redemption_count: 200, sales_impact: 2000 }
  ];

  it('renders chart with correct data', () => {
    render(<DiscountPerformance data={mockData} />);
    
    expect(screen.getByText('Campaign Performance')).toBeInTheDocument();
    expect(screen.getByText('Redemptions')).toBeInTheDocument();
    expect(screen.getByText('Sales Impact ($)')).toBeInTheDocument();
  });

  it('renders empty chart when no data provided', () => {
    render(<DiscountPerformance data={[]} />);
    
    expect(screen.getByText('Campaign Performance')).toBeInTheDocument();
  });
});