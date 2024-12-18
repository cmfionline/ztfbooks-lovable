import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrdersChart } from '../analytics/OrdersChart';

const mockData = [
  { date: '2024-03-01', orders: 10 },
  { date: '2024-03-02', orders: 15 },
  { date: '2024-03-03', orders: 8 },
];

describe('OrdersChart', () => {
  it('renders with title and description', () => {
    render(
      <OrdersChart
        data={mockData}
        title="Test Chart"
        description="Test Description"
      />
    );

    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders with empty data', () => {
    render(
      <OrdersChart
        data={[]}
        title="Empty Chart"
        description="No Data"
      />
    );

    expect(screen.getByText('Empty Chart')).toBeInTheDocument();
  });
});