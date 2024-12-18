import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookForm } from '../BookForm';
import { useBookFormData } from '@/hooks/useBookFormData';
import { useToast } from '@/hooks/use-toast';
import userEvent from '@testing-library/user-event';

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

  it('validates required fields before submission', async () => {
    render(<BookForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByText(/save book/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    // Check for required field error messages
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/language is required/i)).toBeInTheDocument();
    expect(screen.getByText(/author is required/i)).toBeInTheDocument();
  });

  it('validates price when book is not free', async () => {
    render(<BookForm onSubmit={mockOnSubmit} />);
    
    const isFreeToggle = screen.getByRole('switch', { name: /free book/i });
    fireEvent.click(isFreeToggle);
    
    const submitButton = screen.getByText(/save book/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/price must be greater than 0/i)).toBeInTheDocument();
    });
  });

  it('validates discount fields when discount is enabled', async () => {
    render(<BookForm onSubmit={mockOnSubmit} />);
    
    // Enable discount
    const hasDiscountToggle = screen.getByRole('switch', { name: /apply discount/i });
    fireEvent.click(hasDiscountToggle);
    
    const submitButton = screen.getByText(/save book/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/discount percentage is required/i)).toBeInTheDocument();
      expect(screen.getByText(/discount start date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/discount end date is required/i)).toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    render(<BookForm onSubmit={mockOnSubmit} />);
    
    // Fill required fields
    await userEvent.type(screen.getByLabelText(/title/i), 'Test Book');
    await userEvent.selectOptions(screen.getByLabelText(/language/i), '1');
    await userEvent.selectOptions(screen.getByLabelText(/author/i), '1');

    const submitButton = screen.getByText(/save book/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Book',
        languageId: '1',
        authorId: '1',
      }));
    });
  });

  it('handles form submission errors', async () => {
    const error = new Error('Submission failed');
    mockOnSubmit.mockRejectedValueOnce(error);

    render(<BookForm onSubmit={mockOnSubmit} />);
    
    // Fill required fields
    await userEvent.type(screen.getByLabelText(/title/i), 'Test Book');
    await userEvent.selectOptions(screen.getByLabelText(/language/i), '1');
    await userEvent.selectOptions(screen.getByLabelText(/author/i), '1');

    const submitButton = screen.getByText(/save book/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: "Error",
        description: "Submission failed",
        variant: "destructive",
      });
    });
  });
});