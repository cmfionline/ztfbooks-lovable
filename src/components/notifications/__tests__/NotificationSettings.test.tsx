import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationSettings } from '../NotificationSettings';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
  },
}));

describe('NotificationSettings', () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({
      data: { app_id: 'test-app-id', rest_key: 'test-rest-key' },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
  });

  it('renders settings form with existing values', () => {
    render(<NotificationSettings />);
    
    expect(screen.getByText('OneSignal Settings')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-app-id')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('OneSignal REST API Key')).toBeInTheDocument();
  });

  it('handles settings update', async () => {
    render(<NotificationSettings />);
    
    const appIdInput = screen.getByPlaceholderText('OneSignal App ID');
    const restKeyInput = screen.getByPlaceholderText('OneSignal REST API Key');
    const saveButton = screen.getByText('Save Settings');

    fireEvent.change(appIdInput, { target: { value: 'new-app-id' } });
    fireEvent.change(restKeyInput, { target: { value: 'new-rest-key' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success',
          description: 'Settings saved successfully',
        })
      );
    });
  });

  it('disables save button when required fields are empty', () => {
    render(<NotificationSettings />);
    
    const appIdInput = screen.getByPlaceholderText('OneSignal App ID');
    const restKeyInput = screen.getByPlaceholderText('OneSignal REST API Key');
    const saveButton = screen.getByText('Save Settings');

    fireEvent.change(appIdInput, { target: { value: '' } });
    fireEvent.change(restKeyInput, { target: { value: '' } });

    expect(saveButton).toBeDisabled();
  });

  it('shows loading state when fetching settings', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(<NotificationSettings />);
    
    expect(screen.getByPlaceholderText('OneSignal App ID')).toHaveValue('');
    expect(screen.getByPlaceholderText('OneSignal REST API Key')).toHaveValue('');
  });
});