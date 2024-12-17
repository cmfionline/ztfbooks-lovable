import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateFaqDialog from "../CreateFaqDialog";
import { useToast } from "@/components/ui/use-toast";

// Mock the modules
vi.mock("@tanstack/react-query");
vi.mock("@/components/ui/use-toast");
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

describe("CreateFaqDialog", () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

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

  it("renders the dialog when open", () => {
    render(
      <CreateFaqDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        groupId="group1"
      />
    );

    expect(screen.getByText("Create New FAQ")).toBeInTheDocument();
    expect(screen.getByLabelText("Question")).toBeInTheDocument();
    expect(screen.getByLabelText("Answer")).toBeInTheDocument();
  });

  it("doesn't render when closed", () => {
    render(
      <CreateFaqDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        groupId="group1"
      />
    );

    expect(screen.queryByText("Create New FAQ")).not.toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const mockMutate = vi.fn();
    (useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(
      <CreateFaqDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        groupId="group1"
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Question"), {
      target: { value: "Test Question" },
    });
    fireEvent.change(screen.getByLabelText("Answer"), {
      target: { value: "Test Answer" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Create FAQ"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it("shows error toast on submission failure", async () => {
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    const mockError = new Error("Failed to create FAQ");
    (useMutation as any).mockReturnValue({
      mutate: () => {
        throw mockError;
      },
      isPending: false,
    });

    render(
      <CreateFaqDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        groupId="group1"
      />
    );

    // Submit the form
    fireEvent.click(screen.getByText("Create FAQ"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to create FAQ",
        variant: "destructive",
      });
    });
  });
});