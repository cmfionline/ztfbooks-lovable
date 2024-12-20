import { Routes, Route } from "react-router-dom";
import ContentBlocks from "@/pages/ContentBlocks";

export const ContentBlockRoutes = () => {
  return (
    <Routes>
      <Route index element={<ContentBlocks />} />
    </Routes>
  );
};