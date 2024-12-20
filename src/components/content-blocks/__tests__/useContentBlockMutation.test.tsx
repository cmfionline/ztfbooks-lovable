import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useContentBlockMutation } from "../hooks/useContentBlockMutation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

vi.mock("@/hooks/use-toast");
vi.mock("@/lib/supabase");

describe("useContentBlockMutation", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: vi.fn() });
  });

  it("creates a new content block successfully", async () => {
    const newBlock = {
      title: "New Block",
      order_index: 0,
      is_active: true,
    };

    (supabase.from as any).mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: "new-id", ...newBlock } }),
        }),
      }),
    }));

    const { result } = renderHook(() => useContentBlockMutation(), { wrapper });

    result.current.mutate(newBlock);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("updates an existing content block successfully", async () => {
    const updatedBlock = {
      title: "Updated Block",
      order_index: 1,
      is_active: true,
    };

    (supabase.from as any).mockImplementation(() => ({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: "existing-id", ...updatedBlock } }),
          }),
        }),
      }),
    }));

    const { result } = renderHook(() => useContentBlockMutation("existing-id"), { wrapper });

    result.current.mutate(updatedBlock);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("handles errors gracefully", async () => {
    const error = new Error("API Error");
    (supabase.from as any).mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: () => Promise.reject(error),
        }),
      }),
    }));

    const { result } = renderHook(() => useContentBlockMutation(), { wrapper });

    result.current.mutate({
      title: "Test Block",
      order_index: 0,
      is_active: true,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(error);
    });
  });
});