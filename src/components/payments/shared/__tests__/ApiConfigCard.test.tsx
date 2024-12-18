import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ApiConfigCard } from '../ApiConfigCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null })
    }))
  }
}));

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn()
  }))
}));

describe('ApiConfigCard', () => {
  const defaultProps = {
    title: 'Test API Config',
    description: 'Test Description',
    secretKeyPlaceholder: 'sk_test_...',
    getApiKeysUrl: 'https://test.com/keys',
    gatewayType: 'stripe'
  };

  it('renders correctly with all props', () => {
    render(<ApiConfigCard {...defaultProps} />);
    
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(defaultProps.secretKeyPlaceholder)).toBeInTheDocument();
    expect(screen.getByText('Get API Keys')).toBeInTheDocument();
  });

  it('handles API key submission successfully', async () => {
    const mockToast = vi.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    render(<ApiConfigCard {...defaultProps} />);
    
    const input = screen.getByLabelText('Secret Key');
    const form = screen.getByRole('form');
    
    fireEvent.change(input, { target: { value: 'test_key' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('payment_gateways');
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "API keys updated successfully.",
      });
    });
  });

  it('handles API key submission error', async () => {
    const mockToast = vi.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: new Error('Test error') })
    } as any);
    
    render(<ApiConfigCard {...defaultProps} />);
    
    const input = screen.getByLabelText('Secret Key');
    const form = screen.getByRole('form');
    
    fireEvent.change(input, { target: { value: 'test_key' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to update API keys.",
        variant: "destructive",
      });
    });
  });

  it('opens API keys URL in new tab', () => {
    const mockOpen = vi.spyOn(window, 'open').mockImplementation(() => null);
    
    render(<ApiConfigCard {...defaultProps} />);
    
    const getKeysButton = screen.getByText('Get API Keys');
    fireEvent.click(getKeysButton);
    
    expect(mockOpen).toHaveBeenCalledWith(defaultProps.getApiKeysUrl, '_blank');
  });
});