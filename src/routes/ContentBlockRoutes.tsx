import { Routes, Route } from "react-router-dom";
import ContentBlocks from "@/pages/ContentBlocks";
import { ContentBlockForm } from "@/components/content-blocks/ContentBlockForm";
import { useParams } from "react-router-dom";

const EditContentBlock = () => {
  const { id } = useParams();
  return <ContentBlockForm initialData={{ id }} />;
};

export const ContentBlockRoutes = () => {
  return (
    <Routes>
      <Route index element={<ContentBlocks />} />
      <Route 
        path="add" 
        element={<ContentBlockForm />} 
      />
      <Route 
        path=":id/edit" 
        element={<EditContentBlock />} 
      />
    </Routes>
  );
};