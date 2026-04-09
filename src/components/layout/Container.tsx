import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  narrow?: boolean;
}

export function Container({ children, className, narrow = false, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-10",
        narrow && "max-w-4xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
