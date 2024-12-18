import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Books } from "@/pages/Books";

// Mock dependencies
vi.mock("@tanstack/react-query");
vi.mock("@/lib/supabase");
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => vi.fn(),
}));

describe("Books Listing Integration", () => {
  const mockBooks = [
    {
      id: "1",
      title: "Test Book 1",
      author: { name: "Author 1" },
      price: 29.99,
      is_featured: true,
    },
    {
      id: "2",
      title: "Test Book 2",
      author: { name: "Author 2" },
      price: 19.99,
      is_featured: false,
    },
  ];

  beforeEach(() => {
    (useQuery as any).mockReturnValue({
      data: mockBooks,
      isLoading: false,
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: vi.fn().mockResolvedValue({ data: mockBooks, error: null }),
    });
  });

  it("displays books list with correct data", async () => {
    render(<Books />);

    await waitFor(() => {
      expect(screen.getByText("Test Book 1")).toBeInTheDocument();
      expect(screen.getByText("Test Book 2")).toBeInTheDocument();
      expect(screen.getByText("Author 1")).toBeInTheDocument();
      expect(screen.getByText("Author 2")).toBeInTheDocument();
    });
  });

  it("handles search functionality", async () => {
    render(<Books />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "Test Book 1" } });

    await waitFor(() => {
      expect(screen.getByText("Test Book 1")).toBeInTheDocument();
      expect(screen.queryByText("Test Book 2")).not.toBeInTheDocument();
    });
  });

  it("handles filtering by featured status", async () => {
    render(<Books />);

    const featuredFilter = screen.getByLabelText(/featured/i);
    fireEvent.click(featuredFilter);

    await waitFor(() => {
      expect(screen.getByText("Test Book 1")).toBeInTheDocument();
      expect(screen.queryByText("Test Book 2")).not.toBeInTheDocument();
    });
  });

  it("handles error states gracefully", async () => {
    const mockError = new Error("Failed to fetch books");
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
    });

    render(<Books />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});