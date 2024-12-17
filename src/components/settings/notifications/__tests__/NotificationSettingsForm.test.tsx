import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationSettingsForm } from '../NotificationSettingsForm';

describe('NotificationSettingsForm', () => {
  const defaultProps = {
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    isSaving: false,
    onEmailNotificationsChange: vi.fn(),
    onPushNotificationsChange: vi.fn(),
    onMarketingEmailsChange: vi.fn(),
    onSave: vi.fn(),
  };

  it('renders all notification switches', () => {
    render(<NotificationSettingsForm {...defaultProps} />);
    
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('Push Notifications')).toBeInTheDocument();
    expect(screen.getByText('Marketing Emails')).toBeInTheDocument();
  });

  it('calls change handlers when switches are toggled', () => {
    render(<NotificationSettingsForm {...defaultProps} />);
    
    const emailSwitch = screen.getByRole('switch', { name: /email notifications/i });
    fireEvent.click(emailSwitch);
    
    expect(defaultProps.onEmailNotificationsChange).toHaveBeenCalledWith(false);
  });

  it('disables save button while saving', () => {
    render(<NotificationSettingsForm {...defaultProps} isSaving={true} />);
    
    const saveButton = screen.getByRole('button', { name: /saving changes/i });
    expect(saveButton).toBeDisabled();
  });

  it('shows loading spinner while saving', () => {
    render(<NotificationSettingsForm {...defaultProps} isSaving={true} />);
    
    expect(screen.getByText('Saving Changes...')).toBeInTheDocument();
  });

  it('calls onSave when save button is clicked', () => {
    render(<NotificationSettingsForm {...defaultProps} />);
    
    const saveButton = screen.getByRole('button', { name: /save preferences/i });
    fireEvent.click(saveButton);
    
    expect(defaultProps.onSave).toHaveBeenCalled();
  });
});