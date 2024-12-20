import { render, screen, waitFor } from "@testing-library/react";
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
      order: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

describe("Content Blocks Ordering", () => {
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

  it("maintains order using order_index", async () => {
    const blocks = [
      { id: '1', title: 'First Block', order_index: 0 },
      { id: '2', title: 'Second Block', order_index: 1 }
    ];

    (supabase.from as any)().select().order().mockResolvedValue({
      data: blocks,
      error: null
    });

    render(
      <BrowserRouter>
        <ContentBlockForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      const blockElements = screen.getAllByRole('row');
      expect(blockElements[1]).toHaveTextContent('First Block');
      expect(blockElements[2]).toHaveTextContent('Second Block');
    });
  });
});