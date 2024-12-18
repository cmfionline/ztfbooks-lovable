import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BookMetadata } from "@/components/books/components/BookMetadata";
import { useQuery } from "@tanstack/react-query";

// Mock dependencies
vi.mock("@tanstack/react-query");

describe("BookMetadata Integration", () => {
  const mockAuthors = [
    { label: "Author 1", value: "1" },
    { label: "Author 2", value: "2" },
  ];

  const mockPublishers = [
    { label: "Publisher 1", value: "1" },
    { label: "Publisher 2", value: "2" },
  ];

  const mockControl = {
    register: vi.fn(),
    setValue: vi.fn(),
    watch: vi.fn(),
    _formValues: { isFree: false },
  };

  beforeEach(() => {
    (useQuery as any).mockReturnValue({
      data: { authors: mockAuthors, publishers: mockPublishers },
      isLoading: false,
      error: null,
    });
  });

  it("integrates with form control and external data", async () => {
    render(
      <BookMetadata
        control={mockControl as any}
        authors={mockAuthors}
        publishers={mockPublishers}
      />
    );

    // Verify author selection integration
    const authorSelect = screen.getByLabelText(/author/i);
    fireEvent.change(authorSelect, { target: { value: "1" } });
    expect(mockControl.setValue).toHaveBeenCalledWith("authorId", "1");

    // Verify publisher selection integration
    const publisherSelect = screen.getByLabelText(/publisher/i);
    fireEvent.change(publisherSelect, { target: { value: "1" } });
    expect(mockControl.setValue).toHaveBeenCalledWith("publisherId", "1");
  });

  it("handles price field based on isFree toggle", async () => {
    mockControl.watch.mockReturnValue(false); // Not free

    render(
      <BookMetadata
        control={mockControl as any}
        authors={mockAuthors}
        publishers={mockPublishers}
      />
    );

    const priceInput = screen.getByLabelText(/price/i);
    fireEvent.change(priceInput, { target: { value: "29.99" } });
    expect(mockControl.setValue).toHaveBeenCalledWith("price", "29.99");

    // Toggle to free
    const freeToggle = screen.getByRole("checkbox");
    fireEvent.click(freeToggle);
    expect(mockControl.setValue).toHaveBeenCalledWith("isFree", true);
  });

  it("validates required fields", async () => {
    render(
      <BookMetadata
        control={mockControl as any}
        authors={mockAuthors}
        publishers={mockPublishers}
      />
    );

    const authorSelect = screen.getByLabelText(/author/i);
    fireEvent.blur(authorSelect);

    await waitFor(() => {
      expect(screen.getByText(/author is required/i)).toBeInTheDocument();
    });
  });
});