import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestPaymentCard } from '../TestPaymentCard';

describe('TestPaymentCard', () => {
  const defaultProps = {
    title: 'Test Payment',
    description: 'Process a test payment',
    isActive: true,
    isProcessing: false,
    testAmount: '$10.99',
    onTestPayment: vi.fn()
  };

  it('renders correctly with basic props', () => {
    render(<TestPaymentCard {...defaultProps} />);
    
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByText(`Process Test Payment (${defaultProps.testAmount})`)).toBeInTheDocument();
  });

  it('renders email input when onEmailChange is provided', () => {
    const onEmailChange = vi.fn();
    render(
      <TestPaymentCard 
        {...defaultProps} 
        testEmail="test@example.com"
        onEmailChange={onEmailChange}
      />
    );
    
    const emailInput = screen.getByLabelText('Test Email');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue('test@example.com');
    
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    expect(onEmailChange).toHaveBeenCalledWith('new@example.com');
  });

  it('disables button when gateway is inactive', () => {
    render(<TestPaymentCard {...defaultProps} isActive={false} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows loading state when processing', () => {
    render(<TestPaymentCard {...defaultProps} isProcessing={true} />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('handles test payment click', () => {
    render(<TestPaymentCard {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(defaultProps.onTestPayment).toHaveBeenCalled();
  });

  it('disables button when email is required but not provided', () => {
    render(
      <TestPaymentCard 
        {...defaultProps} 
        testEmail=""
        onEmailChange={() => {}}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});