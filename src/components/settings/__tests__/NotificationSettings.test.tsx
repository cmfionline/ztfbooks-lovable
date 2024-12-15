import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationSettings } from '../NotificationSettings';
import { useToast } from '@/hooks/use-toast';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
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
          single: () => ({
            data: {
              email_notifications: true,
              push_notifications: true,
              marketing_emails: false,
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
  },
}));

describe('NotificationSettings', () => {
  it('renders notification settings form', () => {
    render(<NotificationSettings />);
    
    expect(screen.getByText('Email & Push Notifications')).toBeInTheDocument();
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('Push Notifications')).toBeInTheDocument();
    expect(screen.getByText('Marketing Emails')).toBeInTheDocument();
  });

  it('toggles notification settings', async () => {
    render(<NotificationSettings />);
    
    const emailSwitch = screen.getByRole('switch', { name: /email notifications/i });
    const pushSwitch = screen.getByRole('switch', { name: /push notifications/i });
    const marketingSwitch = screen.getByRole('switch', { name: /marketing emails/i });

    fireEvent.click(emailSwitch);
    fireEvent.click(pushSwitch);
    fireEvent.click(marketingSwitch);

    expect(emailSwitch).not.toBeChecked();
    expect(pushSwitch).not.toBeChecked();
    expect(marketingSwitch).toBeChecked();
  });

  it('saves notification preferences', async () => {
    render(<NotificationSettings />);
    
    const saveButton = screen.getByRole('button', { name: /save preferences/i });
    fireEvent.click(saveButton);

    // Verify toast was called (success message)
    expect(useToast().toast).toHaveBeenCalled();
  });
});