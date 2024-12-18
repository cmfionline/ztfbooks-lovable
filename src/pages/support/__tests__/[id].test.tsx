import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TicketDetailsPage from '../[id]';

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      id: '123',
    }),
  };
});

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({
            data: {
              id: '123',
              subject: 'Test Ticket',
              description: 'Test Description',
              status: 'open',
              priority: 'high',
              category: 'technical',
              created_at: '2024-01-01T00:00:00Z',
              profiles: { full_name: 'Test User' },
            },
          }),
        }),
        order: () => ({
          data: [
            {
              id: '1',
              message: 'Test Message',
              created_at: '2024-01-01T00:00:00Z',
              profiles: { full_name: 'Test User' },
            },
          ],
        }),
      }),
    }),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Ticket Details Page', () => {
  it('renders the ticket details', async () => {
    renderWithProviders(<TicketDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Ticket')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });

  it('displays ticket metadata', async () => {
    renderWithProviders(<TicketDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Test User/)).toBeInTheDocument();
      expect(screen.getByText(/technical/)).toBeInTheDocument();
      expect(screen.getByText(/high/)).toBeInTheDocument();
    });
  });

  it('shows the message input form', async () => {
    renderWithProviders(<TicketDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type your message here...')).toBeInTheDocument();
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });
  });

  it('handles sending a new message', async () => {
    renderWithProviders(<TicketDetailsPage />);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Type your message here...');
      const sendButton = screen.getByText('Send Message');
      
      fireEvent.change(input, { target: { value: 'New test message' } });
      fireEvent.click(sendButton);
    });
  });

  it('displays the back button', () => {
    renderWithProviders(<TicketDetailsPage />);
    expect(screen.getByText('Back to Support')).toBeInTheDocument();
  });

  it('shows message history', async () => {
    renderWithProviders(<TicketDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Message')).toBeInTheDocument();
    });
  });
});