import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddBook from "./books/AddBook";
import AuthorsPage from "./books/authors/AuthorsPage";
import SeriesPage from "./books/series/SeriesPage";
import AddSeries from "./books/series/AddSeries";
import PublishersPage from "./books/publishers/PublishersPage";
import AddPublisher from "./books/publishers/AddPublisher";
import TagsPage from "./books/tags/TagsPage";
import AddTag from "./books/tags/AddTag";
import LanguagesPage from "./books/languages/LanguagesPage";
import AddLanguage from "./books/languages/AddLanguage";

const Books = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="text-3xl font-bold mb-8">Books Management</h1>
                <Card>
                  <CardHeader>
                    <CardTitle>All Books</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Books management dashboard coming soon...</p>
                  </CardContent>
                </Card>
              </>
            }
          />
          <Route path="/add" element={<AddBook />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/series/add" element={<AddSeries />} />
          <Route path="/publishers" element={<PublishersPage />} />
          <Route path="/publishers/add" element={<AddPublisher />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/tags/add" element={<AddTag />} />
          <Route path="/languages" element={<LanguagesPage />} />
          <Route path="/languages/add" element={<AddLanguage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Books;