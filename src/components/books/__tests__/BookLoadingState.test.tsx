import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookLoadingState } from '../BookLoadingState';

describe('BookLoadingState', () => {
  it('renders loading spinner', () => {
    render(<BookLoadingState />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has correct styling', () => {
    render(<BookLoadingState />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('text-purple');
  });
});