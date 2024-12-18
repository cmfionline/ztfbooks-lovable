import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdForm } from '../AdForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

// Mock dependencies
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn()
  }))
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'test-url' } }))
      }))
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null })
    }))
  }
}));

describe('AdForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<AdForm onSuccess={mockOnSuccess} />);
    
    expect(screen.getByLabelText(/Campaign Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Placement/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    const { getByText, getByLabelText } = render(<AdForm onSuccess={mockOnSuccess} />);
    
    fireEvent.change(getByLabelText(/Campaign Name/i), { target: { value: 'Test Campaign' } });
    fireEvent.change(getByLabelText(/Content/i), { target: { value: 'Test content description' } });
    
    fireEvent.click(getByText('Create Ad'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: "Success",
        description: "The ad has been successfully created.",
      });
    });
  });

  it('handles image upload', async () => {
    const { getByLabelText } = render(<AdForm onSuccess={mockOnSuccess} />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = getByLabelText(/Image/i);
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith('ads');
    });
  });

  it('displays validation errors', async () => {
    const { getByText } = render(<AdForm onSuccess={mockOnSuccess} />);
    
    fireEvent.click(getByText('Create Ad'));

    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Content must be at least 10 characters/i)).toBeInTheDocument();
    });
  });
});