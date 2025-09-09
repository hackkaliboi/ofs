
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonEffectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
}

const ButtonEffect = ({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonEffectProps) => {
  const baseClass = variant === "primary" ? "custodia-btn-primary" : "custodia-btn-secondary";
  
  return (
    <button 
      className={cn(baseClass, className)}
      {...props}
    >
      <span className="flex items-center justify-center">{children}</span>
      <div className="absolute inset-0 w-full h-full bg-yellow-400/10 scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
    </button>
  );
};

export default ButtonEffect;
