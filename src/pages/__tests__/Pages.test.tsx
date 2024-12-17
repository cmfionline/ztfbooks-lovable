import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vi } from "vitest";
import Pages from "../Pages";
import { useToast } from "@/hooks/use-toast";

// Mock the modules
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
    
    // Mock useQuery
    (useQuery as any).mockReturnValue({
      data: mockPages,
      isLoading: false,
    });

    // Mock useToast
    (useToast as any).mockReturnValue({
      toast: vi.fn(),
      dismiss: vi.fn(),
      toasts: [],
    });

    // Mock useMutation
    (useMutation as any).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    // Mock useQueryClient
    (useQueryClient as any).mockReturnValue({
      invalidateQueries: vi.fn(),
    });
  });

  it("renders the pages list", () => {
    render(
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    );

    expect(screen.getByText("Pages Management")).toBeInTheDocument();
    expect(screen.getByText("Test Page 1")).toBeInTheDocument();
    expect(screen.getByText("Test Page 2")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    (useQuery as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("navigates to add page when clicking Add Page button", () => {
    render(
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    );

    const addButton = screen.getByText("Add Page");
    fireEvent.click(addButton);

    // Check if the navigation occurred
    expect(window.location.pathname).toBe("/pages/add");
  });

  it("shows correct status badges", () => {
    render(
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    );

    const activeStatus = screen.getByText("active");
    const draftStatus = screen.getByText("draft");

    expect(activeStatus).toHaveClass("bg-green-500/10");
    expect(draftStatus).toHaveClass("bg-gray-500/10");
  });

  it("handles page deletion", async () => {
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    const mockMutate = vi.fn();
    (useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    );

    // Find and click delete button for first page
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion in alert dialog
    const confirmButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith("1");
    });
  });
});