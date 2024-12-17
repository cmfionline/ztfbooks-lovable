import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationTargeting } from '../NotificationTargeting';

describe('NotificationTargeting', () => {
  const defaultProps = {
    targetAudience: { type: 'all' },
    onTargetAudienceChange: vi.fn(),
  };

  it('renders target audience selector', () => {
    render(<NotificationTargeting {...defaultProps} />);
    
    expect(screen.getByText('Target Audience')).toBeInTheDocument();
  });

  it('shows all targeting options', async () => {
    render(<NotificationTargeting {...defaultProps} />);
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    expect(screen.getByText('All Users')).toBeInTheDocument();
    expect(screen.getByText('Premium Users')).toBeInTheDocument();
    expect(screen.getByText('Free Users')).toBeInTheDocument();
    expect(screen.getByText('Inactive Users')).toBeInTheDocument();
  });

  it('calls onChange handler when target audience changes', async () => {
    const onTargetAudienceChange = vi.fn();
    
    render(
      <NotificationTargeting
        {...defaultProps}
        onTargetAudienceChange={onTargetAudienceChange}
      />
    );
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    const premiumOption = screen.getByText('Premium Users');
    fireEvent.click(premiumOption);
    
    expect(onTargetAudienceChange).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'premium' })
    );
  });
});