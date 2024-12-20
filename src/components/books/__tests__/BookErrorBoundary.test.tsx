import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookErrorBoundary } from '../BookErrorBoundary';
import { useToast } from '@/hooks/use-toast';

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

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
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('shows network error message for network errors', () => {
    const ThrowNetworkError = () => {
      throw new TypeError('Failed to fetch');
    };

    render(
      <BookErrorBoundary>
        <ThrowNetworkError />
      </BookErrorBoundary>
    );

    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  it('shows auth error message for unauthorized access', () => {
    const ThrowAuthError = () => {
      throw new Error('unauthorized access');
    };

    render(
      <BookErrorBoundary>
        <ThrowAuthError />
      </BookErrorBoundary>
    );

    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });

  it('calls toast when error occurs', () => {
    const mockToast = vi.fn();
    (useToast as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ toast: mockToast });

    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <BookErrorBoundary>
        <ThrowError />
      </BookErrorBoundary>
    );

    expect(mockToast).toHaveBeenCalled();
  });

  it('resets error boundary when try again is clicked', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <BookErrorBoundary>
        <ThrowError />
      </BookErrorBoundary>
    );

    const tryAgainButton = screen.getByText(/try again/i);
    fireEvent.click(tryAgainButton);

    // After reset, error boundary should try to render children again
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});