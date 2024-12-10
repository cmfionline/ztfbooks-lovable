import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="text-3xl font-bold mb-8">Settings</h1>
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Settings dashboard coming soon...</p>
                </CardContent>
              </Card>
            </>
          } />
          <Route path="/smtp" element={<h1>SMTP Email Settings</h1>} />
          <Route path="/notifications" element={<h1>OneSignal Notifications</h1>} />
          <Route path="/ordering" element={<h1>Ordering Settings</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default Settings;