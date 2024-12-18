import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EnableGatewayCard } from '../EnableGatewayCard';

describe('EnableGatewayCard', () => {
  const defaultProps = {
    title: 'Test Gateway',
    description: 'Test Description',
    isActive: false,
    isLoading: false,
    onToggle: vi.fn()
  };

  it('renders correctly with inactive state', () => {
    render(<EnableGatewayCard {...defaultProps} />);
    
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('renders correctly with active state', () => {
    render(<EnableGatewayCard {...defaultProps} isActive={true} />);
    
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('handles toggle interaction', () => {
    render(<EnableGatewayCard {...defaultProps} />);
    
    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);
    
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('disables toggle when loading', () => {
    render(<EnableGatewayCard {...defaultProps} isLoading={true} />);
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeDisabled();
  });

  it('displays correct icon based on active state', () => {
    const { rerender } = render(<EnableGatewayCard {...defaultProps} />);
    
    expect(screen.getByTestId('x-circle')).toBeInTheDocument();
    
    rerender(<EnableGatewayCard {...defaultProps} isActive={true} />);
    
    expect(screen.getByTestId('check-circle')).toBeInTheDocument();
  });
});