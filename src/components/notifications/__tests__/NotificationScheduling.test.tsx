import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationScheduling } from '../NotificationScheduling';

describe('NotificationScheduling', () => {
  const defaultProps = {
    scheduleType: 'immediate' as const,
    scheduledFor: '',
    recurringSchedule: null,
    onScheduleTypeChange: vi.fn(),
    onScheduledForChange: vi.fn(),
    onRecurringScheduleChange: vi.fn(),
  };

  it('renders all schedule options', () => {
    render(<NotificationScheduling {...defaultProps} />);
    
    expect(screen.getByText('Send Immediately')).toBeInTheDocument();
    expect(screen.getByText('Schedule for Later')).toBeInTheDocument();
    expect(screen.getByText('Recurring Schedule')).toBeInTheDocument();
  });

  it('shows scheduled date input when schedule for later is selected', () => {
    render(
      <NotificationScheduling
        {...defaultProps}
        scheduleType="scheduled"
      />
    );
    
    expect(screen.getByLabelText('Schedule Date & Time')).toBeInTheDocument();
  });

  it('shows recurring options when recurring schedule is selected', () => {
    render(
      <NotificationScheduling
        {...defaultProps}
        scheduleType="recurring"
      />
    );
    
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
  });

  it('calls onChange handlers when schedule type changes', () => {
    const onScheduleTypeChange = vi.fn();
    
    render(
      <NotificationScheduling
        {...defaultProps}
        onScheduleTypeChange={onScheduleTypeChange}
      />
    );
    
    fireEvent.click(screen.getByText('Schedule for Later'));
    
    expect(onScheduleTypeChange).toHaveBeenCalledWith('scheduled');
  });
});