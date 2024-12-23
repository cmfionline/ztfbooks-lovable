import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagForm } from '../components/TagForm';

describe('TagForm Interactions', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  it('handles cancel button click', () => {
    render(
      <TagForm
        defaultValues={{ name: 'Test Tag' }}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isLoading={false}
      />
    );

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(mockCancel).toHaveBeenCalled();
  });

  it('displays loading state correctly', () => {
    render(
      <TagForm
        defaultValues={{ name: 'Test Tag' }}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        isLoading={true}
      />
    );

    expect(screen.getByRole('button', { name: /update tag/i })).toBeDisabled();
  });
});