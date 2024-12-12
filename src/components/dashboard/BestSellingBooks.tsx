import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BookOpen } from "lucide-react";

interface OrderItem {
  quantity: number;
  book_id: string;
  books: {
    title: string;
    cover_image: string | null;
    price: number;
    authors: {
      name: string;
    };
  } | null;
}

const BestSellingBooks = () => {
  const { data: books } = useQuery<OrderItem[]>({
    queryKey: ["best-selling-books"],
    queryFn: async () => {
      const { data: orderItems, error } = await supabase
        .from("order_items")
        .select(`
          quantity,
          book_id,
          books (
            title,
            cover_image,
            price,
            authors (
              name
            )
          )
        `)
        .order("quantity", { ascending: false })
        .limit(5);

      if (error) throw error;

      return orderItems || [];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Best Selling Books
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {books?.map((item) => (
            <div key={item.book_id} className="flex items-center gap-4">
              {item.books?.cover_image && (
                <img
                  src={item.books.cover_image}
                  alt={item.books?.title}
                  className="h-16 w-12 object-cover rounded-sm"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.books?.title}</p>
                <p className="text-xs text-muted-foreground">
                  by {item.books?.authors?.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-purple">
                    ${item.books?.price}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.quantity} sold
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BestSellingBooks;