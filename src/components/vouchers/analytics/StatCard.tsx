import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  description: string;
  value: string | number;
  subValue?: string;
  className?: string;
}

export const StatCard = ({ 
  title, 
  description, 
  value, 
  subValue,
  className = "" 
}: StatCardProps) => {
  return (
    <Card className={`bg-white/50 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      <CardHeader>
        <CardTitle className="text-purple-800">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-purple-600">{value}</div>
        {subValue && (
          <div className="text-sm text-purple-500 mt-2">{subValue}</div>
        )}
      </CardContent>
    </Card>
  );
};