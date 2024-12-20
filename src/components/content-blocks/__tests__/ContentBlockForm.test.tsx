import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContentBlockForm } from "../ContentBlockForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockToast = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: mockToast });
    
    // Mock admin session
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

  const renderForm = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ContentBlockForm onSuccess={mockOnSuccess} {...props} />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it("renders form fields correctly", async () => {
    renderForm();

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
    (supabase.from as any)().insert().select().single.mockResolvedValueOnce({
      data: { id: "new-block-id", title: "Test Block" },
    });

    renderForm();

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: "Test Block" } });
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
    renderForm();

    const submitButton = screen.getByRole("button", { name: /create content block/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    const error = new Error("API Error");
    (supabase.from as any)().insert().select().single.mockRejectedValueOnce(error);

    renderForm();

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: "Test Block" } });
    });

    const submitButton = screen.getByRole("button", { name: /create content block/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "API Error",
        variant: "destructive",
      });
    });
  });

  it("shows loading state during submission", async () => {
    renderForm();

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/title/i);
      fireEvent.change(titleInput, { target: { value: "Test Block" } });
    });

    const submitButton = screen.getByRole("button", { name: /create content block/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/creating/i)).toBeInTheDocument();
  });
});