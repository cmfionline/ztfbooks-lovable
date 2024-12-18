import { Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, BookOpen, Users, BookMarked, Building2, Tags } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useToast } from "@/hooks/use-toast";
import AddBook from "./books/AddBook";
import EditBook from "./books/EditBook";
import AuthorsPage from "./books/authors/AuthorsPage";
import AddAuthor from "./books/authors/AddAuthor";
import EditAuthor from "./books/authors/EditAuthor";
import SeriesPage from "./books/series/SeriesPage";
import AddSeries from "./books/series/AddSeries";
import EditSeries from "./books/series/EditSeries";
import PublishersPage from "./books/publishers/PublishersPage";
import AddPublisher from "./books/publishers/AddPublisher";
import EditPublisher from "./books/publishers/EditPublisher";
import TagsPage from "./books/tags/TagsPage";
import AddTag from "./books/tags/AddTag";
import EditTag from "./books/tags/EditTag";
import EbooksPage from "./books/ebooks/EbooksPage";

const BooksListing = () => {
  return <EbooksPage />;
};

const Books = () => {
  return (
    <Routes>
      <Route index element={<BooksListing />} />
      <Route path="add" element={<AddBook />} />
      <Route path=":id/edit" element={<EditBook />} />
      <Route path="ebooks/*" element={<EbooksPage />} />
      <Route path="authors" element={<AuthorsPage />} />
      <Route path="authors/add" element={<AddAuthor />} />
      <Route path="authors/:id/edit" element={<EditAuthor />} />
      <Route path="series" element={<SeriesPage />} />
      <Route path="series/add" element={<AddSeries />} />
      <Route path="series/:id/edit" element={<EditSeries />} />
      <Route path="publishers" element={<PublishersPage />} />
      <Route path="publishers/add" element={<AddPublisher />} />
      <Route path="publishers/:id/edit" element={<EditPublisher />} />
      <Route path="tags" element={<TagsPage />} />
      <Route path="tags/add" element={<AddTag />} />
      <Route path="tags/:id/edit" element={<EditTag />} />
    </Routes>
  );
};

export default Books;