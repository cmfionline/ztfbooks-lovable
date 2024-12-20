import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContentBlockForm } from "../ContentBlockForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Mock modules
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
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

describe("Content Blocks Integration Tests", () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: mockToast });
  });

  describe("View Content Blocks (Public Access)", () => {
    it("allows viewing content blocks without authentication", async () => {
      // Mock unauthenticated session
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: null }
      });

      // Mock content blocks data
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

  describe("Admin Operations", () => {
    beforeEach(() => {
      // Mock admin session
      (supabase.auth.getSession as any).mockResolvedValue({
        data: {
          session: {
            user: { id: "admin-id" }
          }
        }
      });

      (supabase.from as any)().select().single.mockResolvedValue({
        data: { role: "admin" },
        error: null
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

      (supabase.from as any)().insert.mockResolvedValue({
        data: { id: '3', ...newBlock },
        error: null
      });

      render(
        <BrowserRouter>
          <ContentBlockForm />
        </BrowserRouter>
      );

      // Fill form
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/title/i), {
          target: { value: newBlock.title }
        });
        fireEvent.change(screen.getByLabelText(/subtitle/i), {
          target: { value: newBlock.subtitle }
        });
        // ... fill other fields
      });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /create content block/i }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Content block created successfully"
        });
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

  describe("Non-Admin Access Restrictions", () => {
    beforeEach(() => {
      // Mock non-admin session
      (supabase.auth.getSession as any).mockResolvedValue({
        data: {
          session: {
            user: { id: "user-id" }
          }
        }
      });

      (supabase.from as any)().select().single.mockResolvedValue({
        data: { role: "client" },
        error: null
      });
    });

    it("prevents non-admins from accessing content block management", async () => {
      render(
        <BrowserRouter>
          <ContentBlockForm />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Access denied",
          description: "You need admin privileges to manage content blocks",
          variant: "destructive"
        });
      });
    });
  });
});