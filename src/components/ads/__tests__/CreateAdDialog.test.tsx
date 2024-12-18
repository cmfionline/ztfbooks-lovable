import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateAdDialog from '../CreateAdDialog';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

// Mock dependencies
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn()
  }))
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn()
  }))
}));

describe('CreateAdDialog', () => {
  const mockOnOpenChange = vi.fn();
  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dialog when open', () => {
    render(<CreateAdDialog {...defaultProps} />);
    
    expect(screen.getByText('Create New Advertisement')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    render(<CreateAdDialog {...defaultProps} />);
    
    fireEvent.change(screen.getByLabelText(/Campaign Name/i), {
      target: { value: 'Test Campaign' }
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: 'Test content description' }
    });
    
    fireEvent.click(screen.getByText('Create Ad'));

    await waitFor(() => {
      expect(useQueryClient().invalidateQueries).toHaveBeenCalledWith({ queryKey: ['ads'] });
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      expect(useToast().toast).toHaveBeenCalledWith({
        title: "Success",
        description: "The ad has been successfully created.",
      });
    });
  });

  it('closes dialog when cancelled', () => {
    render(<CreateAdDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('validates required fields', async () => {
    render(<CreateAdDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Create Ad'));

    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Content must be at least 10 characters/i)).toBeInTheDocument();
    });
  });
});