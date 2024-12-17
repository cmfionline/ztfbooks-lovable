import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationForm } from '../NotificationForm';
import { useNotificationSubmit } from '../hooks/useNotificationSubmit';
import { useNotificationTest } from '../hooks/useNotificationTest';
import { useToast } from '@/hooks/use-toast';

// Mock the hooks
vi.mock('../hooks/useNotificationSubmit', () => ({
  useNotificationSubmit: vi.fn(),
}));

vi.mock('../hooks/useNotificationTest', () => ({
  useNotificationTest: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('NotificationForm', () => {
  const mockSubmit = vi.fn();
  const mockTest = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.mocked(useNotificationSubmit).mockReturnValue({
      isSubmitting: false,
      retryCount: 0,
      submitNotification: mockSubmit,
    });

    vi.mocked(useNotificationTest).mockReturnValue({
      isTesting: false,
      retryCount: 0,
      testNotification: mockTest,
    });

    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });
  });

  it('renders all form sections', () => {
    render(<NotificationForm />);
    
    expect(screen.getByText('Create Notification')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter notification title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter notification message')).toBeInTheDocument();
    expect(screen.getByText('Send Immediately')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<NotificationForm />);
    
    const titleInput = screen.getByPlaceholderText('Enter notification title');
    const messageInput = screen.getByPlaceholderText('Enter notification message');
    const submitButton = screen.getByText('Create Notification');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Title',
        message: 'Test Message',
      }));
    });
  });

  it('handles test notification', async () => {
    render(<NotificationForm />);
    
    const titleInput = screen.getByPlaceholderText('Enter notification title');
    const messageInput = screen.getByPlaceholderText('Enter notification message');
    const testButton = screen.getByText('Test Send');

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });
    fireEvent.click(testButton);

    await waitFor(() => {
      expect(mockTest).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Title',
        message: 'Test Message',
      }));
    });
  });

  it('shows loading state during submission', () => {
    vi.mocked(useNotificationSubmit).mockReturnValue({
      isSubmitting: true,
      retryCount: 0,
      submitNotification: mockSubmit,
    });

    render(<NotificationForm />);
    
    expect(screen.getByText('Creating...')).toBeInTheDocument();
  });
});