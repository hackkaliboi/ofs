
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4;
}

const AnimatedSection = ({ 
  children, 
  className,
  delay = 1
}: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className={cn(
        "reveal", 
        delay === 1 ? "reveal-delay-1" : 
        delay === 2 ? "reveal-delay-2" : 
        delay === 3 ? "reveal-delay-3" : 
        "reveal-delay-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
