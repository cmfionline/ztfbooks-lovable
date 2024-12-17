import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookFiles } from '../BookFiles';
import { createMockControl } from '@/test/form-helpers';

describe('BookFiles', () => {
  const mockControl = createMockControl();

  it('renders file upload fields', () => {
    render(<BookFiles control={mockControl} />);
    
    expect(screen.getByLabelText(/cover image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/epub file/i)).toBeInTheDocument();
  });

  it('handles cover image upload', () => {
    render(<BookFiles control={mockControl} />);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    const input = screen.getByLabelText(/cover image/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(input.files?.[0]).toBe(file);
  });

  it('handles epub file upload', () => {
    render(<BookFiles control={mockControl} />);
    const file = new File(['test'], 'test.epub', { type: 'application/epub+zip' });
    
    const input = screen.getByLabelText(/epub file/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(input.files?.[0]).toBe(file);
  });

  it('shows file size limit message', () => {
    render(<BookFiles control={mockControl} maxFileSize={5 * 1024 * 1024} />);
    expect(screen.getByText(/maximum size: 5mb/i)).toBeInTheDocument();
  });
});