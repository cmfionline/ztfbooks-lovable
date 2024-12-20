import { Route } from "react-router-dom";
import ContentBlocks from "@/pages/ContentBlocks";
import { ContentBlockForm } from "@/components/content-blocks/ContentBlockForm";

export const ContentBlockRoutes = () => {
  return (
    <Route path="content-blocks">
      <Route index element={<ContentBlocks />} />
      <Route path="add" element={<ContentBlockForm />} />
      <Route path=":id/edit" element={<ContentBlockForm />} />
    </Route>
  );
};