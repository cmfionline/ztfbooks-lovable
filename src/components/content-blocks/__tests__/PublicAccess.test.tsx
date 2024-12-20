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
    })),
  },
}));

describe("Content Blocks Public Access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: vi.fn() });
  });

  it("allows viewing content blocks without authentication", async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null }
    });

    (supabase.from as any)().select().order().mockResolvedValue({
      data: [
        { id: '1', title: 'Test Block', order_index: 0 },
        { id: '2', title: 'Another Block', order_index: 1 }
      ],
      error: null
    });

    render(
      <BrowserRouter>
        <ContentBlockForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Block')).toBeInTheDocument();
      expect(screen.getByText('Another Block')).toBeInTheDocument();
    });
  });
});