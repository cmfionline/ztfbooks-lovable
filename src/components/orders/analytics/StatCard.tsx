import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  subValue?: string;
  className?: string;
}

export const StatCard = ({ title, value, description, subValue, className }: StatCardProps) => {
  return (
    <Card className={`bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <CardHeader>
        <CardTitle className="text-purple-800">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-purple-600">{value}</p>
        {subValue && (
          <p className="text-sm text-muted-foreground mt-2">{subValue}</p>
        )}
      </CardContent>
    </Card>
  );
};