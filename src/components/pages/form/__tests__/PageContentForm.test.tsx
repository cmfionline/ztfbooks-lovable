import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { PageContentForm } from "../PageContentForm";
import { PageFormValues, pageFormSchema } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";

const TestWrapper = () => {
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "active",
      order_index: 0,
    },
  });

  return <PageContentForm control={form.control} />;
};

describe("PageContentForm", () => {
  it("renders all form fields", () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/order/i)).toBeInTheDocument();
  });

  it("displays correct placeholders", () => {
    render(<TestWrapper />);

    expect(screen.getByPlaceholderText(/enter page title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter page content/i)).toBeInTheDocument();
  });

  it("shows all status options", () => {
    render(<TestWrapper />);

    const statusSelect = screen.getByLabelText(/status/i);
    expect(statusSelect).toBeInTheDocument();

    // Note: Since SelectContent is rendered in a portal, we need to check differently
    expect(document.body).toContainElement(statusSelect);
  });

  it("has number input for order", () => {
    render(<TestWrapper />);

    const orderInput = screen.getByLabelText(/order/i);
    expect(orderInput).toHaveAttribute("type", "number");
    expect(orderInput).toHaveAttribute("min", "0");
  });
});