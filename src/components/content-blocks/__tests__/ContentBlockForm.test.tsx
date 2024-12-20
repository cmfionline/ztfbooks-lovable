import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContentBlockForm } from "../ContentBlockForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Mock the modules
vi.mock("@/hooks/use-toast");
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      update: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
    })),
  },
}));

describe("ContentBlockForm", () => {
  const mockToast = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useToast as any).mockReturnValue({
      toast: mockToast,
    });

    // Mock auth session with admin role
    (supabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: {
          user: { id: "test-user-id" }
        }
      }
    });

    (supabase.from as any)().select().eq().single.mockResolvedValue({
      data: { role: "admin" },
    });
  });

  it("renders form fields correctly", async () => {
    render(
      <BrowserRouter>
        <ContentBlockForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/subtitle/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/button text/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/button link/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/order index/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/active/i)).toBeInTheDocument();
    });
  });

  it("handles form submission correctly", async () => {
    render(
      <BrowserRouter>
        <ContentBlockForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: "Test Title" } });
    });

    const submitButton = screen.getByRole("button", { name: /create content block/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Content block created successfully",
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("handles validation errors", async () => {
    render(
      <BrowserRouter>
        <ContentBlockForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole("button", { name: /create content block/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });
  });

  it("handles non-admin access correctly", async () => {
    // Mock non-admin role
    (supabase.from as any)().select().eq().single.mockResolvedValue({
      data: { role: "user" },
    });

    render(
      <BrowserRouter>
        <ContentBlockForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Access denied",
        description: "You need admin privileges to manage content blocks",
        variant: "destructive",
      });
    });
  });

  it("handles view action correctly", async () => {
    const mockBlock = {
      id: "test-id",
      title: "Test Block",
      subtitle: "Test Subtitle",
      description: "Test Description",
      image_url: "https://example.com/image.jpg",
      button_text: "Click Me",
      button_link: "https://example.com",
      order_index: 1,
      is_active: true,
    };

    render(
      <BrowserRouter>
        <ContentBlockForm initialData={mockBlock} onSuccess={mockOnSuccess} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Block")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Subtitle")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
      expect(screen.getByDisplayValue("https://example.com/image.jpg")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Click Me")).toBeInTheDocument();
      expect(screen.getByDisplayValue("https://example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    });
  });
});