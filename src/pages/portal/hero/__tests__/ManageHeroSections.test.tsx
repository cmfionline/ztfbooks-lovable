import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ManageHeroSections from "../ManageHeroSections";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

vi.mock("@/hooks/use-toast");
vi.mock("@/lib/supabase");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockHeroSections = [
  {
    id: "1",
    title: "Test Hero 1",
    subtitle: "Test Subtitle 1",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    primary_button_text: "Click Me",
    secondary_button_text: "Learn More",
    primary_button_link: "/test1",
    secondary_button_link: "/learn1",
  },
  {
    id: "2",
    title: "Test Hero 2",
    subtitle: "Test Subtitle 2",
    is_active: false,
    created_at: "2024-01-02T00:00:00Z",
    primary_button_text: "Click Me 2",
    secondary_button_text: "Learn More 2",
    primary_button_link: "/test2",
    secondary_button_link: "/learn2",
  },
];

describe("ManageHeroSections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (useToast as any).mockReturnValue({
      toast: vi.fn(),
    });

    (supabase.from as any).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: mockHeroSections,
        error: null,
      }),
      update: vi.fn().mockResolvedValue({ error: null }),
    }));
  });

  it("renders hero sections list", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ManageHeroSections />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Hero 1")).toBeInTheDocument();
      expect(screen.getByText("Test Hero 2")).toBeInTheDocument();
    });
  });

  it("toggles hero section status", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ManageHeroSections />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      const toggleButtons = screen.getAllByRole("switch");
      expect(toggleButtons[0]).toBeInTheDocument();
      fireEvent.click(toggleButtons[0]);
    });

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("hero_sections");
    });
  });

  it("shows preview when clicking on a hero section", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ManageHeroSections />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      const heroSection = screen.getByText("Test Hero 1");
      fireEvent.click(heroSection);
      expect(screen.getByText("Preview")).toBeInTheDocument();
    });
  });
});