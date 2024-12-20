import { Routes, Route } from "react-router-dom";
import ContentBlocks from "@/pages/ContentBlocks";
import { ViewContentBlockView } from "@/components/content-blocks/views/ViewContentBlockView";
import { EditContentBlockView } from "@/components/content-blocks/views/EditContentBlockView";

export const ContentBlockRoutes = () => {
  return (
    <Routes>
      <Route index element={<ContentBlocks />} />
      <Route path=":id" element={<ViewContentBlockView />} />
      <Route path=":id/edit" element={<EditContentBlockView />} />
    </Routes>
  );
};