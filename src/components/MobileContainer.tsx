import { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

const MobileContainer = ({ children, className = "" }: MobileContainerProps) => {
  return (
    <div className="min-h-screen bg-muted">
      <div className={`mx-auto max-w-md bg-background min-h-screen ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default MobileContainer;
