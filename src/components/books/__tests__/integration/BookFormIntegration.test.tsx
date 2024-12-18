import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BookForm } from "@/components/books/BookForm";
import { useBookFormData } from "@/hooks/useBookFormData";
import { useToast } from "@/hooks/use-toast";

// Mock the hooks
vi.mock("@/hooks/useBookFormData");
vi.mock("@/hooks/use-toast");

describe("BookForm Integration", () => {
  const mockSeries = [
    { label: "Test Series", value: "series-1" },
  ];
  const mockAuthors = [
    { label: "Test Author", value: "author-1" },
  ];
  const mockPublishers = [
    { label: "Test Publisher", value: "publisher-1" },
  ];
  const mockTags = [
    { label: "Test Tag", value: "tag-1" },
  ];
  const mockLanguages = [
    { label: "English", value: "lang-1" },
  ];

  beforeEach(() => {
    (useBookFormData as any).mockReturnValue({
      series: mockSeries,
      authors: mockAuthors,
      publishers: mockPublishers,
      tags: mockTags,
      languages: mockLanguages,
      isLoading: false,
      error: null,
    });

    (useToast as any).mockReturnValue({
      toast: vi.fn(),
    });
  });

  it("submits form data correctly with all fields filled", async () => {
    const onSubmit = vi.fn();
    render(<BookForm onSubmit={onSubmit} />);

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Book" },
    });

    fireEvent.change(screen.getByLabelText(/synopsis/i), {
      target: { value: "Test Synopsis" },
    });

    // Select series
    const seriesSelect = screen.getByLabelText(/series/i);
    fireEvent.change(seriesSelect, { target: { value: "series-1" } });

    // Select language
    const languageSelect = screen.getByLabelText(/language/i);
    fireEvent.change(languageSelect, { target: { value: "lang-1" } });

    // Submit form
    fireEvent.click(screen.getByText(/save book/i));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: "Test Book",
        synopsis: "Test Synopsis",
        seriesId: "series-1",
        languageId: "lang-1",
      }));
    });
  });

  it("displays error toast when submission fails", async () => {
    const mockError = new Error("Submission failed");
    const onSubmit = vi.fn().mockRejectedValue(mockError);
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({ toast: mockToast });

    render(<BookForm onSubmit={onSubmit} />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Book" },
    });

    // Submit form
    fireEvent.click(screen.getByText(/save book/i));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Error",
        variant: "destructive",
      }));
    });
  });

  it("loads initial data correctly when provided", () => {
    const initialData = {
      title: "Existing Book",
      synopsis: "Existing Synopsis",
      seriesId: "series-1",
      languageId: "lang-1",
      tags: ["tag-1"],
    };

    render(<BookForm initialData={initialData} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue("Existing Book");
    expect(screen.getByLabelText(/synopsis/i)).toHaveValue("Existing Synopsis");
  });
});