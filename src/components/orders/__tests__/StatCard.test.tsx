import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../analytics/StatCard';

describe('StatCard', () => {
  it('renders with required props', () => {
    render(
      <StatCard
        title="Total Orders"
        value={100}
        icon="shopping-cart"
      />
    );
    
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with percentage change', () => {
    render(
      <StatCard
        title="Total Orders"
        value={100}
        icon="shopping-cart"
        percentageChange={15}
      />
    );
    
    expect(screen.getByText('+15%')).toBeInTheDocument();
  });

  it('handles negative percentage change', () => {
    render(
      <StatCard
        title="Total Orders"
        value={100}
        icon="shopping-cart"
        percentageChange={-10}
      />
    );
    
    expect(screen.getByText('-10%')).toBeInTheDocument();
  });

  it('renders with custom color', () => {
    render(
      <StatCard
        title="Total Orders"
        value={100}
        icon="shopping-cart"
        color="purple"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('bg-purple-50');
  });
});