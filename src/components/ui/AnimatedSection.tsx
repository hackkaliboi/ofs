
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AnimationType = 'reveal' | 'slide-left' | 'slide-right' | 'slide-up' | 'zoom' | 'scale' | 'fade' | 'stagger';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4;
  animation?: AnimationType;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  staggerDelay?: number;
}

const AnimatedSection = ({ 
  children, 
  className,
  delay = 1,
  animation = 'reveal',
  threshold = 0.1,
  rootMargin = "0px 0px -100px 0px",
  once = true,
  staggerDelay = 100
}: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          entry.target.classList.add('active');
          
          // Handle stagger animation for child elements
          if (animation === 'stagger') {
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('active');
              }, index * staggerDelay);
            });
          }
          
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
          entry.target.classList.remove('active');
          
          // Remove active class from children for stagger
          if (animation === 'stagger') {
            const children = entry.target.children;
            Array.from(children).forEach((child) => {
              child.classList.remove('active');
            });
          }
        }
      });
    }, {
      threshold,
      rootMargin
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [animation, threshold, rootMargin, once, staggerDelay]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'slide-left':
        return 'reveal-slide-left';
      case 'slide-right':
        return 'reveal-slide-right';
      case 'slide-up':
        return 'reveal-slide-up';
      case 'zoom':
        return 'reveal-zoom';
      case 'scale':
        return 'reveal-scale';
      case 'fade':
        return 'reveal-fade';
      case 'stagger':
        return 'reveal-stagger';
      default:
        return 'reveal';
    }
  };

  const getDelayClass = () => {
    if (animation === 'stagger') return ''; // Stagger handles its own delays
    
    switch (delay) {
      case 1: return 'reveal-delay-1';
      case 2: return 'reveal-delay-2';
      case 3: return 'reveal-delay-3';
      case 4: return 'reveal-delay-4';
      default: return 'reveal-delay-1';
    }
  };

  return (
    <div 
      ref={sectionRef}
      className={cn(
        getAnimationClass(),
        getDelayClass(),
        className
      )}
      data-animation={animation}
      data-visible={isVisible}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
