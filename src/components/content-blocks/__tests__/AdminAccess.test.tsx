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
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

describe("Content Blocks Admin Access", () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: mockToast });
    
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

  it("allows admins to create content blocks", async () => {
    const newBlock = {
      title: "New Block",
      subtitle: "Test Subtitle",
      description: "Test Description",
      image_url: "https://example.com/image.jpg",
      button_text: "Click Me",
      button_link: "https://example.com",
      order_index: 0,
      is_active: true
    };

    render(
      <BrowserRouter>
        <ContentBlockForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: newBlock.title }
      });
      fireEvent.change(screen.getByLabelText(/subtitle/i), {
        target: { value: newBlock.subtitle }
      });
    });

    fireEvent.click(screen.getByRole('button', { name: /create content block/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Content block created successfully"
      });
    });
  });
});