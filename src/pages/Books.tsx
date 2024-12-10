import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddBook from "./books/AddBook";
import AuthorsPage from "./books/authors/AuthorsPage";

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
          <Route path="/series" element={<h1>Series</h1>} />
          <Route path="/tags" element={<h1>Tags</h1>} />
          <Route path="/publishers" element={<h1>Publishers</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default Books;