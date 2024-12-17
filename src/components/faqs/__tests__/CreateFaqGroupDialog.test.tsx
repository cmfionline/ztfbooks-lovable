import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateFaqGroupDialog from "../CreateFaqGroupDialog";
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

describe("CreateFaqGroupDialog", () => {
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
      <CreateFaqGroupDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.getByText("Create New FAQ Group")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("doesn't render when closed", () => {
    render(
      <CreateFaqGroupDialog open={false} onOpenChange={mockOnOpenChange} />
    );

    expect(screen.queryByText("Create New FAQ Group")).not.toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const mockMutate = vi.fn();
    (useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(
      <CreateFaqGroupDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test Group" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Create Group"));

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

    const mockError = new Error("Failed to create group");
    (useMutation as any).mockReturnValue({
      mutate: () => {
        throw mockError;
      },
      isPending: false,
    });

    render(
      <CreateFaqGroupDialog open={true} onOpenChange={mockOnOpenChange} />
    );

    // Submit the form
    fireEvent.click(screen.getByText("Create Group"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to create FAQ group",
        variant: "destructive",
      });
    });
  });
});