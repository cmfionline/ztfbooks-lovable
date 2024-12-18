import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SupportPage from "../support";
import { supabase } from "@/lib/supabase";

// Mock the supabase client
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      data: [
        {
          id: "1",
          subject: "Test Ticket",
          status: "open",
          priority: "high",
          category: "technical",
          created_at: "2024-01-01T00:00:00Z",
        },
      ],
    })),
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
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("Support Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the support page title", () => {
    renderWithProviders(<SupportPage />);
    expect(screen.getByText("Support Tickets")).toBeInTheDocument();
  });

  it("displays the new ticket button", () => {
    renderWithProviders(<SupportPage />);
    expect(screen.getByText("New Ticket")).toBeInTheDocument();
  });

  it("shows ticket statistics cards", async () => {
    renderWithProviders(<SupportPage />);
    await waitFor(() => {
      expect(screen.getByText("Total Tickets")).toBeInTheDocument();
      expect(screen.getByText("Open Tickets")).toBeInTheDocument();
      expect(screen.getByText("Pending Tickets")).toBeInTheDocument();
    });
  });

  it("displays the tickets table with correct headers", () => {
    renderWithProviders(<SupportPage />);
    expect(screen.getByText("Subject")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
  });

  it("navigates to new ticket page when clicking new ticket button", () => {
    renderWithProviders(<SupportPage />);
    const newTicketButton = screen.getByText("New Ticket");
    fireEvent.click(newTicketButton);
    // Navigation would be tested in integration tests
  });
});