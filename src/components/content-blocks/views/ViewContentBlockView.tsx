import { useParams, useNavigate } from "react-router-dom";
import { useContentBlock } from "../hooks/useContentBlock";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, Pencil } from "lucide-react";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";
import { z } from "zod";

const idSchema = z.string().uuid("Invalid content block ID format");

export const ViewContentBlockView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Validate ID before using it
  try {
    if (id) {
      idSchema.parse(id);
    }
  } catch (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-6 rounded-lg bg-destructive/10 text-destructive">
          <h2 className="text-lg font-semibold mb-2">Invalid Content Block ID</h2>
          <p className="mb-4">The provided ID is not in the correct format.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/content-blocks")}
            className="mt-2"
          >
            Back to Content Blocks
          </Button>
        </div>
      </div>
    );
  }

  const { data: contentBlock, isLoading } = useContentBlock(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!contentBlock) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-6 rounded-lg bg-destructive/10 text-destructive">
          <h2 className="text-lg font-semibold mb-2">Content Block Not Found</h2>
          <p className="mb-4">The requested content block could not be found.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/content-blocks")}
            className="mt-2"
          >
            Back to Content Blocks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <QueryErrorBoundary>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/content-blocks")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={() => navigate(`/content-blocks/${id}/edit`)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </div>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">{contentBlock.title}</h1>
          {contentBlock.subtitle && (
            <h2 className="text-xl text-gray-600 mb-4">{contentBlock.subtitle}</h2>
          )}
          {contentBlock.description && (
            <p className="text-gray-600 mb-4">{contentBlock.description}</p>
          )}
          {contentBlock.image_url && (
            <img 
              src={contentBlock.image_url} 
              alt={contentBlock.title}
              className="max-w-full h-auto rounded-lg mb-4" 
            />
          )}
          {contentBlock.button_text && contentBlock.button_link && (
            <div className="mt-4">
              <Button asChild>
                <a 
                  href={contentBlock.button_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {contentBlock.button_text}
                </a>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </QueryErrorBoundary>
  );
};