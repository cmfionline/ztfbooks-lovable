import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaymentGatewayHeader } from '../PaymentGatewayHeader';
import { CreditCard } from 'lucide-react';

describe('PaymentGatewayHeader', () => {
  const defaultProps = {
    title: 'Test Gateway',
    description: 'Test Description',
    icon: CreditCard
  };

  it('renders correctly with all props', () => {
    render(<PaymentGatewayHeader {...defaultProps} />);
    
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByTestId('credit-card')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<PaymentGatewayHeader {...defaultProps} />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('mb-6');
    
    const icon = screen.getByTestId('credit-card');
    expect(icon).toHaveClass('text-purple');
  });
});