import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarSubmenu } from '../SidebarSubmenu';
import { BrowserRouter } from 'react-router-dom';

const mockProps = {
  title: 'Test Submenu',
  icon: <span data-testid="test-icon">Icon</span>,
  items: [
    { title: 'Item 1', path: '/test/1' },
    { title: 'Item 2', path: '/test/2' },
  ],
  isActive: false,
  isCollapsed: false,
  isOpen: false,
  onToggle: vi.fn(),
  onItemClick: vi.fn(),
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SidebarSubmenu', () => {
  it('renders submenu trigger correctly', () => {
    renderWithRouter(<SidebarSubmenu {...mockProps} />);
    
    expect(screen.getByText('Test Submenu')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('toggles submenu on click', () => {
    renderWithRouter(<SidebarSubmenu {...mockProps} />);
    
    fireEvent.click(screen.getByText('Test Submenu'));
    expect(mockProps.onToggle).toHaveBeenCalled();
  });

  it('renders submenu items when open', () => {
    renderWithRouter(<SidebarSubmenu {...mockProps} isOpen={true} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('hides submenu items when collapsed', () => {
    renderWithRouter(<SidebarSubmenu {...mockProps} isCollapsed={true} />);
    
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
  });

  it('calls onItemClick when submenu item is clicked', () => {
    renderWithRouter(<SidebarSubmenu {...mockProps} isOpen={true} />);
    
    fireEvent.click(screen.getByText('Item 1'));
    expect(mockProps.onItemClick).toHaveBeenCalled();
  });

  it('applies active styles when isActive is true', () => {
    renderWithRouter(<SidebarSubmenu {...mockProps} isActive={true} />);
    
    const trigger = screen.getByText('Test Submenu').closest('button');
    expect(trigger).toHaveClass('bg-purple-light/10', 'text-purple', 'font-medium');
  });
});