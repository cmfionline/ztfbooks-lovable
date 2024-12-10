import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Pages = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="text-3xl font-bold mb-8">Pages Management</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Content Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Pages management coming soon...</p>
                </CardContent>
              </Card>
            </>
          } />
          <Route path="/about" element={<h1>About Us</h1>} />
          <Route path="/privacy" element={<h1>Privacy Policy</h1>} />
          <Route path="/terms" element={<h1>Terms of Service</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default Pages;