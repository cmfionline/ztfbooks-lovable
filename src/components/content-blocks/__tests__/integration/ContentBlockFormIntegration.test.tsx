import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentBlockForm } from "../../ContentBlockForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Mock dependencies
vi.mock("@/hooks/use-toast");
vi.mock("@/lib/supabase");

describe("ContentBlockForm Integration", () => {
  const mockToast = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: mockToast });
  });

  it("handles successful form submission with optimistic updates", async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: { id: "test-id", title: "Test Block" },
      error: null,
    });

    (supabase.from as any).mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: mockInsert,
        }),
      }),
    }));

    render(<ContentBlockForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Block" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Content block created successfully",
      });
    });
  });

  it("handles network errors during submission", async () => {
    const networkError = new Error("Network error");
    (supabase.from as any).mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: () => Promise.reject(networkError),
        }),
      }),
    }));

    render(<ContentBlockForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Block" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Network error",
        variant: "destructive",
      });
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it("handles Supabase errors during submission", async () => {
    const supabaseError = { message: "Database error" };
    (supabase.from as any).mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: () => ({ data: null, error: supabaseError }),
        }),
      }),
    }));

    render(<ContentBlockForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Block" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Database error",
        variant: "destructive",
      });
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});