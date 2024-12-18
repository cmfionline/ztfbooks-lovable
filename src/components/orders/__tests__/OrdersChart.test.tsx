import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrdersChart } from '../analytics/OrdersChart';

describe('OrdersChart', () => {
  const mockData = [
    { date: '2024-01-01', orders: 10, revenue: 1000 },
    { date: '2024-01-02', orders: 15, revenue: 1500 }
  ];

  it('renders chart with data', () => {
    render(<OrdersChart data={mockData} />);
    
    expect(screen.getByText(/orders over time/i)).toBeInTheDocument();
    expect(screen.getByTestId('orders-chart')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    render(<OrdersChart data={[]} />);
    
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it('displays correct axes labels', () => {
    render(<OrdersChart data={mockData} />);
    
    expect(screen.getByText(/date/i)).toBeInTheDocument();
    expect(screen.getByText(/orders/i)).toBeInTheDocument();
  });
});