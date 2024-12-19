import { Book } from "@/types/book";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface PromotionalBannerProps {
  book: Book;
}

export const PromotionalBanner = ({ book }: PromotionalBannerProps) => {
  const coverImageUrl = book.cover_image
    ? supabase.storage.from('books').getPublicUrl(book.cover_image).data.publicUrl
    : null;

  const isDiscountActive = book.discount_percentage && 
    book.discount_start_date && 
    book.discount_end_date &&
    new Date(book.discount_start_date) <= new Date() &&
    new Date(book.discount_end_date) >= new Date();

  if (!isDiscountActive) return null;

  const discountedPrice = book.price - (book.price * (book.discount_percentage / 100));

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-100 to-purple-50">
        <div className="space-y-4">
          <Badge variant="secondary" className="bg-purple-100">
            <Percent className="w-4 h-4 mr-1" />
            {book.discount_percentage}% OFF
          </Badge>
          
          <h3 className="text-2xl font-bold text-purple-900">{book.title}</h3>
          
          <div className="space-y-1">
            <p className="text-sm text-purple-700">by {book.authors?.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-900">
                {formatPrice(discountedPrice)}
              </span>
              <span className="text-sm text-purple-600 line-through">
                {formatPrice(book.price)}
              </span>
            </div>
          </div>

          <Button className="bg-purple hover:bg-purple/90">
            View Details
          </Button>
        </div>

        {coverImageUrl && (
          <div className="relative w-48 h-64 ml-8">
            <img
              src={coverImageUrl}
              alt={book.title}
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
      </div>
    </Card>
  );
};