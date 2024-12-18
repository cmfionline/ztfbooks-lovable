import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarMenuItem } from '../SidebarMenuItem';
import { BrowserRouter } from 'react-router-dom';

const mockProps = {
  title: 'Test Item',
  path: '/test',
  icon: <span data-testid="test-icon">Icon</span>,
  isActive: false,
  isCollapsed: false,
  onClick: vi.fn(),
  isSubmenuItem: false,
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SidebarMenuItem', () => {
  it('renders correctly with all props', () => {
    renderWithRouter(<SidebarMenuItem {...mockProps} />);
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });

  it('handles click events', () => {
    renderWithRouter(<SidebarMenuItem {...mockProps} />);
    
    fireEvent.click(screen.getByRole('link'));
    expect(mockProps.onClick).toHaveBeenCalled();
  });

  it('shows only icon when collapsed', () => {
    renderWithRouter(<SidebarMenuItem {...mockProps} isCollapsed={true} />);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.queryByText('Test Item')).not.toBeInTheDocument();
  });

  it('applies active styles when isActive is true', () => {
    renderWithRouter(<SidebarMenuItem {...mockProps} isActive={true} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('bg-purple-light/10', 'text-purple', 'font-medium');
  });

  it('renders as submenu item when isSubmenuItem is true', () => {
    renderWithRouter(<SidebarMenuItem {...mockProps} isSubmenuItem={true} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveClass('ml-6');
  });
});