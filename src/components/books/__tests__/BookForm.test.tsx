import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookForm } from '../BookForm';
import { useBookFormData } from '@/hooks/useBookFormData';
import { useToast } from '@/hooks/use-toast';

// Mock the hooks
vi.mock('@/hooks/useBookFormData');
vi.mock('@/hooks/use-toast');

describe('BookForm', () => {
  const mockOnSubmit = vi.fn();
  const mockToast = { toast: vi.fn() };
  const mockFormData = {
    series: [{ label: 'Test Series', value: '1' }],
    authors: [{ label: 'Test Author', value: '1' }],
    publishers: [{ label: 'Test Publisher', value: '1' }],
    tags: [{ label: 'Test Tag', value: '1' }],
    languages: [{ label: 'English', value: '1' }],
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useBookFormData as any).mockReturnValue(mockFormData);
    (useToast as any).mockReturnValue(mockToast);
  });

  it('renders loading state when data is loading', () => {
    (useBookFormData as any).mockReturnValue({ ...mockFormData, isLoading: true });
    render(<BookForm onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error toast when form data fails to load', () => {
    (useBookFormData as any).mockReturnValue({ 
      ...mockFormData, 
      error: new Error('Failed to load') 
    });
    render(<BookForm onSubmit={mockOnSubmit} />);
    expect(mockToast.toast).toHaveBeenCalledWith({
      title: "Error",
      description: "Failed to load form data. Please try again.",
      variant: "destructive",
    });
  });

  it('renders form fields when data is loaded', () => {
    render(<BookForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/series/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/synopsis/i)).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    render(<BookForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Book' }
    });

    fireEvent.click(screen.getByText(/save book/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});