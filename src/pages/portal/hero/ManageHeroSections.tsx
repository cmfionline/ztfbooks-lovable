import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroForm } from "./components/HeroForm";
import { HeroPreview } from "./components/HeroPreview";
import { Plus, Eye, Edit, ToggleLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const ManageHeroSections = () => {
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const { data: heroSections, isLoading } = useQuery({
    queryKey: ["hero-sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_sections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading hero sections",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
  });

  const currentHero = heroSections?.find((hero) => hero.id === selectedHeroId) || heroSections?.[0];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Hero Sections</h1>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Hero Section
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Preview
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  {isEditing ? "Preview" : "Edit"}
                </Button>
                <Button variant="outline" size="sm">
                  <ToggleLeft className="w-4 h-4 mr-2" />
                  Toggle Active
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <HeroForm
                initialData={currentHero}
                onSubmit={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <HeroPreview data={currentHero} />
            )}
          </CardContent>
        </Card>

        {/* List of Hero Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {heroSections?.map((hero) => (
                <div
                  key={hero.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    hero.id === currentHero?.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedHeroId(hero.id)}
                >
                  <h3 className="font-medium">{hero.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{hero.subtitle}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        hero.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {hero.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Created: {new Date(hero.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageHeroSections;