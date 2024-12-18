import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../analytics/StatCard';

describe('StatCard', () => {
  it('renders all props correctly', () => {
    const props = {
      title: 'Total Orders',
      value: '150',
      description: 'Orders this month',
      subValue: '+10% from last month',
      className: 'test-class',
    };

    render(<StatCard {...props} />);

    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Orders this month')).toBeInTheDocument();
    expect(screen.getByText('+10% from last month')).toBeInTheDocument();
  });

  it('renders without optional props', () => {
    const props = {
      title: 'Revenue',
      value: '$1000',
      description: 'Monthly revenue',
    };

    render(<StatCard {...props} />);

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();
    expect(screen.getByText('Monthly revenue')).toBeInTheDocument();
  });
});