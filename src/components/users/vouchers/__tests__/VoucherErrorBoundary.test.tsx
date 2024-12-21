import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VoucherErrorBoundary } from '../components/VoucherErrorBoundary';

describe('VoucherErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  it('renders error UI when child component throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <VoucherErrorBoundary>
        <ThrowError />
      </VoucherErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('renders children when no error occurs', () => {
    render(
      <VoucherErrorBoundary>
        <div>Test Content</div>
      </VoucherErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});