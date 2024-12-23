import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TagForm } from '../components/TagForm';

describe('TagForm Validation', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  it('validates required fields', async () => {
    render(
      <TagForm
        defaultValues={{ name: 'Test Tag' }}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isLoading={false}
      />
    );

    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: '' } });

    const submitButton = screen.getByText(/update tag/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});