import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContentBlockForm } from "../ContentBlockForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
    })),
  },
}));

describe("Content Blocks Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: vi.fn() });
    
    // Mock admin session
    (supabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: {
          user: { id: "admin-id" }
        }
      }
    });

    (supabase.from as any)().select().eq().single.mockResolvedValue({
      data: { role: "admin" },
    });
  });

  it("validates form inputs using Zod schema", async () => {
    render(
      <BrowserRouter>
        <ContentBlockForm />
      </BrowserRouter>
    );

    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /create content block/i }));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });

    // Test URL validation
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: "invalid-url" }
    });

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid URL")).toBeInTheDocument();
    });
  });
});