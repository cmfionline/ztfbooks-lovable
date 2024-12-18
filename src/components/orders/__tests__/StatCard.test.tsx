import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../analytics/StatCard';

describe('StatCard', () => {
  it('renders with required props', () => {
    render(
      <StatCard
        title="Total Orders"
        value={100}
        description="All orders"
      />
    );
    
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('All orders')).toBeInTheDocument();
  });

  it('renders with sub value', () => {
    render(
      <StatCard
        title="Total Orders"
        value={100}
        description="All orders"
        subValue="15% increase"
      />
    );
    
    expect(screen.getByText('15% increase')).toBeInTheDocument();
  });

  it('renders with negative sub value', () => {
    render(
      <StatCard
        title="Total Orders"
        value={100}
        description="All orders"
        subValue="-10% decrease"
      />
    );
    
    expect(screen.getByText('-10% decrease')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <StatCard
        title="Total Orders"
        value={100}
        description="All orders"
        className="custom-class"
      />
    );
    
    const card = screen.getByText('Total Orders').closest('.custom-class');
    expect(card).toBeInTheDocument();
  });
});