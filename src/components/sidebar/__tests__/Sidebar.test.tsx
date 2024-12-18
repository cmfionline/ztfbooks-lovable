import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '@/components/Sidebar';
import { BrowserRouter } from 'react-router-dom';

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Sidebar', () => {
  it('renders correctly with all menu items', () => {
    renderWithRouter(<Sidebar />);
    
    expect(screen.getByText('ZTF Books Admin')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
  });

  it('toggles collapse state when toggle button is clicked', () => {
    renderWithRouter(<Sidebar />);
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    expect(screen.queryByText('ZTF Books Admin')).not.toBeInTheDocument();
  });

  it('collapses on mobile when menu item is clicked', () => {
    mockInnerWidth(500); // Set mobile width
    renderWithRouter(<Sidebar />);
    
    fireEvent.click(screen.getByText('Dashboard'));
    expect(screen.queryByText('ZTF Books Admin')).not.toBeInTheDocument();
  });

  it('toggles submenu when clicked', () => {
    renderWithRouter(<Sidebar />);
    
    fireEvent.click(screen.getByText('Orders'));
    expect(screen.getByText('All Orders')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Orders'));
    expect(screen.queryByText('All Orders')).not.toBeInTheDocument();
  });

  it('expands sidebar and opens submenu when collapsed sidebar submenu is clicked', () => {
    renderWithRouter(<Sidebar />);
    
    // First collapse the sidebar
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    // Click on a collapsed submenu
    const ordersButton = screen.getByTestId('submenu-Orders');
    fireEvent.click(ordersButton);
    
    // Verify sidebar is expanded and submenu is open
    expect(screen.getByText('ZTF Books Admin')).toBeInTheDocument();
    expect(screen.getByText('All Orders')).toBeInTheDocument();
  });

  it('renders client portal link', () => {
    renderWithRouter(<Sidebar />);
    
    const portalLink = screen.getByText('Client Portal');
    expect(portalLink).toBeInTheDocument();
    expect(portalLink.closest('a')).toHaveAttribute('href', '/portal');
    expect(portalLink.closest('a')).toHaveAttribute('target', '_blank');
  });
});