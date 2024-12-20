import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentBlockForm } from "../ContentBlockForm";
import { useToast } from "@/hooks/use-toast";

vi.mock("@/hooks/use-toast");

describe("ContentBlockForm", () => {
  const mockToast = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: mockToast });
  });

  it("validates required fields", async () => {
    render(<ContentBlockForm />);
    
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });
  });

  it("validates title length", async () => {
    render(<ContentBlockForm />);
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "a" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText("Title must be at least 3 characters")).toBeInTheDocument();
    });
  });

  it("validates URL format for button link", async () => {
    render(<ContentBlockForm />);
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Valid Title" },
    });
    
    fireEvent.change(screen.getByLabelText(/button link/i), {
      target: { value: "invalid-url" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid URL format")).toBeInTheDocument();
    });
  });

  it("handles empty optional fields correctly", async () => {
    render(<ContentBlockForm />);
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Valid Title" },
    });

    // Leave optional fields empty
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(screen.queryByText("Invalid URL format")).not.toBeInTheDocument();
      expect(screen.queryByText("Button text is required")).not.toBeInTheDocument();
    });
  });

  it("displays loading state during submission", async () => {
    render(<ContentBlockForm />);
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Block" },
    });

    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/creating/i)).toBeInTheDocument();
  });

  it("preserves form values after failed submission", async () => {
    render(<ContentBlockForm />);
    
    const title = "Test Block";
    const description = "Test Description";
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: title },
    });
    
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: description },
    });

    // Trigger a failed submission
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue(title);
      expect(screen.getByLabelText(/description/i)).toHaveValue(description);
    });
  });
});