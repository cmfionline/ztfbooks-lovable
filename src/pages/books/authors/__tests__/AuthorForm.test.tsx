import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthorForm } from '../components/AuthorForm';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('AuthorForm', () => {
  const mockOnSubmit = vi.fn();

  it('validates required fields', async () => {
    renderWithRouter(<AuthorForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByText(/create author/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('validates website URL format', async () => {
    renderWithRouter(<AuthorForm onSubmit={mockOnSubmit} />);
    
    const websiteInput = screen.getByLabelText(/website/i);
    await userEvent.type(websiteInput, 'invalid-url');
    
    const submitButton = screen.getByText(/create author/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid website url/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    renderWithRouter(<AuthorForm onSubmit={mockOnSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/website/i), 'https://example.com');
    
    const submitButton = screen.getByText(/create author/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        website: 'https://example.com',
      }));
    });
  });

  it('shows loading state during submission', () => {
    renderWithRouter(<AuthorForm onSubmit={mockOnSubmit} isSubmitting={true} />);
    
    expect(screen.getByText(/creating\.\.\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /creating\.\.\./i })).toBeDisabled();
  });
});