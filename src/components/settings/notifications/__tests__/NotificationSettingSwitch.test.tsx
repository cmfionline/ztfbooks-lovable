import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationSettingSwitch } from '../NotificationSettingSwitch';

describe('NotificationSettingSwitch', () => {
  const defaultProps = {
    id: 'test-switch',
    label: 'Test Switch',
    description: 'Test Description',
    checked: false,
    onCheckedChange: vi.fn(),
  };

  it('renders switch with label and description', () => {
    render(<NotificationSettingSwitch {...defaultProps} />);
    
    expect(screen.getByText('Test Switch')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onCheckedChange when toggled', () => {
    render(<NotificationSettingSwitch {...defaultProps} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(defaultProps.onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('reflects checked state correctly', () => {
    render(<NotificationSettingSwitch {...defaultProps} checked={true} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeChecked();
  });
});