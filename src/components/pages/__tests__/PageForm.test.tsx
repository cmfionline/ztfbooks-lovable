import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PageForm from "../PageForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Mock the modules
vi.mock("@/hooks/use-toast");
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
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

describe("PageForm", () => {
  const mockNavigate = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useToast
    (useToast as any).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    // Mock auth.getUser
    (supabase.auth.getUser as any).mockResolvedValue({
      data: {
        user: { id: "test-user-id" },
      },
    });

    // Mock profiles query
    (supabase.from as any)().select().eq().single.mockResolvedValue({
      data: { role: "admin" },
    });
  });

  it("renders the form correctly", () => {
    render(
      <BrowserRouter>
        <PageForm />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/order/i)).toBeInTheDocument();
  });

  it("handles form submission for new page", async () => {
    (supabase.from as any)().insert.mockResolvedValue({ error: null });

    render(
      <BrowserRouter>
        <PageForm />
      </BrowserRouter>
    );

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Page" },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "Test Content" },
    });
    fireEvent.change(screen.getByLabelText(/order/i), {
      target: { value: "1" },
    });

    // Submit form
    fireEvent.click(screen.getByText(/create page/i));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Page created successfully",
      });
    });
  });

  it("handles form submission for editing", async () => {
    const initialData = {
      id: "1",
      title: "Existing Page",
      content: "Existing Content",
      status: "active" as const,
      order_index: 1,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    };

    (supabase.from as any)().update.mockResolvedValue({ error: null });

    render(
      <BrowserRouter>
        <PageForm initialData={initialData} isEditing={true} />
      </BrowserRouter>
    );

    // Modify form fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Updated Page" },
    });

    // Submit form
    fireEvent.click(screen.getByText(/update page/i));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Page updated successfully",
      });
    });
  });

  it("handles authentication error", async () => {
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: null },
    });

    render(
      <BrowserRouter>
        <PageForm />
      </BrowserRouter>
    );

    // Submit form
    fireEvent.click(screen.getByText(/create page/i));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Authentication Error",
        description: "You must be logged in to perform this action",
        variant: "destructive",
      });
    });
  });

  it("handles permission error", async () => {
    (supabase.from as any)().select().eq().single.mockResolvedValue({
      data: { role: "user" },
    });

    render(
      <BrowserRouter>
        <PageForm />
      </BrowserRouter>
    );

    // Submit form
    fireEvent.click(screen.getByText(/create page/i));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Permission Denied",
        description: "You don't have permission to perform this action",
        variant: "destructive",
      });
    });
  });
});