import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FaqGroupsList from "../FaqGroupsList";
import { useToast } from "@/components/ui/use-toast";

// Mock the modules
vi.mock("@tanstack/react-query");
vi.mock("@/components/ui/use-toast");
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn(),
      update: vi.fn().mockReturnThis(),
    })),
  },
}));

const mockGroups = [
  {
    id: "1",
    name: "General FAQs",
    description: "Common questions about our service",
    faqs: [
      {
        id: "faq1",
        question: "What is this service?",
        answer: "This is a test service",
        order_index: 0,
      },
      {
        id: "faq2",
        question: "How does it work?",
        answer: "It works great!",
        order_index: 1,
      },
    ],
  },
  {
    id: "2",
    name: "Technical Support",
    description: "Technical questions and answers",
    faqs: [],
  },
];

describe("FaqGroupsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useQuery
    (useQuery as any).mockReturnValue({
      data: mockGroups,
      isLoading: false,
    });

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

  it("renders FAQ groups and their FAQs", () => {
    render(<FaqGroupsList groups={mockGroups} />);

    expect(screen.getByText("General FAQs")).toBeInTheDocument();
    expect(screen.getByText("Technical Support")).toBeInTheDocument();
    expect(screen.getByText("What is this service?")).toBeInTheDocument();
    expect(screen.getByText("How does it work?")).toBeInTheDocument();
  });

  it("handles FAQ deletion", async () => {
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    const mockMutate = vi.fn();
    (useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<FaqGroupsList groups={mockGroups} />);

    // Find and click delete button for first FAQ
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith("faq1");
    });
  });

  it("opens create FAQ dialog when Add FAQ button is clicked", () => {
    render(<FaqGroupsList groups={mockGroups} />);

    const addButtons = screen.getAllByText("Add FAQ");
    fireEvent.click(addButtons[0]);

    expect(screen.getByText("Create New FAQ")).toBeInTheDocument();
  });

  it("handles FAQ reordering", async () => {
    const mockMutate = vi.fn();
    (useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<FaqGroupsList groups={mockGroups} />);

    // Simulate drag end event
    const event = {
      active: { id: "faq1" },
      over: { id: "faq2" },
    };

    // Find the DndContext and trigger onDragEnd
    const dndContext = screen.getByTestId("dnd-context");
    fireEvent.dragEnd(dndContext, event);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        faqId: "faq1",
        newIndex: 1,
        groupId: "1",
      });
    });
  });
});