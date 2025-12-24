import { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

const MobileContainer = ({ children, className = "" }: MobileContainerProps) => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background">
      <div className={`w-full min-h-screen min-h-[100dvh] bg-background ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default MobileContainer;
