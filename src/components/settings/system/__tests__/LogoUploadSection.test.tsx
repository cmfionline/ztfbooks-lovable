import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LogoUploadSection } from '../LogoUploadSection';

describe('LogoUploadSection', () => {
  const mockOnUpload = vi.fn();

  it('renders the logo upload section', () => {
    render(
      <LogoUploadSection
        type="admin"
        logoUrl={null}
        onUpload={mockOnUpload}
      />
    );

    expect(screen.getByLabelText(/admin portal logo/i)).toBeInTheDocument();
  });

  it('displays existing logo when provided', () => {
    const logoUrl = 'https://example.com/logo.png';
    render(
      <LogoUploadSection
        type="admin"
        logoUrl={logoUrl}
        onUpload={mockOnUpload}
      />
    );

    expect(screen.getByAltText(/admin logo/i)).toHaveAttribute('src', logoUrl);
  });

  it('handles file upload', () => {
    render(
      <LogoUploadSection
        type="admin"
        logoUrl={null}
        onUpload={mockOnUpload}
      />
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/admin portal logo/i);

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnUpload).toHaveBeenCalledWith(file, 'admin');
  });
});