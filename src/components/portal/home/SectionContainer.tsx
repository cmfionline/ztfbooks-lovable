import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  background?: "white" | "light";
}

export const SectionContainer = ({ 
  children, 
  className,
  background = "white" 
}: SectionContainerProps) => {
  return (
    <section className={cn(
      "py-16",
      background === "white" ? "bg-white" : "bg-[#FAFAF8]",
      className
    )}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};