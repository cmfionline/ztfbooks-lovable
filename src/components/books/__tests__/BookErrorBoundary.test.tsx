import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookErrorBoundary } from '../BookErrorBoundary';

describe('BookErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <BookErrorBoundary>
        <div>Test Content</div>
      </BookErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <BookErrorBoundary>
        <ThrowError />
      </BookErrorBoundary>
    );
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});