import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Pages from "../Pages";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

vi.mock("@tanstack/react-query");
vi.mock("@/hooks/use-toast");
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn(),
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

const mockPages = [
  {
    id: "1",
    title: "Test Page 1",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Test Page 2",
    status: "draft",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
];

describe("Pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (useToast as any).mockReturnValue({
      toast: vi.fn(),
    });

    (supabase.from as any)().select().order.mockResolvedValue({
      data: mockPages,
      error: null,
    });
  });

  it("renders the pages list", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Page 1")).toBeInTheDocument();
      expect(screen.getByText("Test Page 2")).toBeInTheDocument();
    });
  });

  it("handles page deletion", async () => {
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({
      toast: mockToast,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      fireEvent.click(deleteButtons[0]);
    });

    const confirmButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("pages");
    });
  });

  it("navigates to add page when clicking Add Page button", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </QueryClientProvider>
    );

    const addButton = screen.getByText(/add page/i);
    fireEvent.click(addButton);

    expect(window.location.pathname).toContain("/add");
  });
});