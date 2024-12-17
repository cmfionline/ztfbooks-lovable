import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GlobalSettings } from '../GlobalSettings';
import { useToast } from '@/hooks/use-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: [],
  }),
}));

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: () => ({
        data: {
          user: { id: 'test-user-id' },
        },
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => ({
            data: {
              settings: {
                site_name: 'Test Site',
                contact_email: 'test@example.com',
                support_phone: '1234567890',
                logos: {
                  admin: null,
                  client: null,
                },
              },
            },
            error: null,
          }),
        }),
      }),
      upsert: () => ({
        select: () => ({
          single: () => ({
            error: null,
          }),
        }),
      }),
    }),
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'test-url' } }),
      }),
    },
  },
}));

describe('GlobalSettings', () => {
  const queryClient = new QueryClient();

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <GlobalSettings />
      </QueryClientProvider>
    );
  };

  it('renders the global settings form', () => {
    renderComponent();
    
    expect(screen.getByText('Global Configuration')).toBeInTheDocument();
    expect(screen.getByLabelText(/site name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/support email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/support phone/i)).toBeInTheDocument();
  });

  it('loads and displays existing settings', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Site')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    });
  });

  it('handles form submission successfully', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Site')).toBeInTheDocument();
    });

    const siteNameInput = screen.getByLabelText(/site name/i);
    fireEvent.change(siteNameInput, { target: { value: 'Updated Site Name' } });

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success',
          description: 'Global settings updated successfully',
        })
      );
    });
  });

  it('handles logo upload', async () => {
    renderComponent();

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getAllByLabelText(/portal logo/i)[0];

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalled();
    });
  });

  it('validates required fields', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Site')).toBeInTheDocument();
    });

    const siteNameInput = screen.getByLabelText(/site name/i);
    fireEvent.change(siteNameInput, { target: { value: '' } });

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Site name must be at least 2 characters')).toBeInTheDocument();
    });
  });
});