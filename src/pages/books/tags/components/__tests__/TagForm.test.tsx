import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TagForm } from '../TagForm';

describe('TagForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const renderComponent = (props = {}) => {
    return render(
      <TagForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        {...props}
      />
    );
  };

  it('renders with default values', () => {
    const defaultValues = { name: 'Test Tag' };
    renderComponent({ defaultValues });
    expect(screen.getByDisplayValue('Test Tag')).toBeInTheDocument();
  });

  it('shows validation error for empty name', async () => {
    renderComponent();
    
    const submitButton = screen.getByText(/update tag/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with form values', async () => {
    renderComponent();
    
    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: 'New Tag' } });

    const submitButton = screen.getByText(/update tag/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'New Tag' });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderComponent();
    
    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    renderComponent({ isLoading: true });
    
    expect(screen.getByRole('button', { name: /update tag/i })).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});