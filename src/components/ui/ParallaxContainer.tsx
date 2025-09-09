import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface ParallaxLayer {
  id: string;
  speed: number;
  element: React.ReactNode;
  className?: string;
  zIndex?: number;
}

interface ParallaxContainerProps {
  children: React.ReactNode;
  layers?: ParallaxLayer[];
  className?: string;
}

// Simplified ParallaxContainer with minimal scroll effects for better performance
const ParallaxContainer: React.FC<ParallaxContainerProps> = ({ 
  children, 
  layers = [], 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Removed heavy scroll-based transforms for better performance

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Static Layers - No scroll-based animation for better performance */}
      {layers.map((layer, index) => {
        return (
          <div
            key={layer.id}
            style={{ 
              zIndex: layer.zIndex || 0
            }}
            className={`absolute inset-0 ${layer.className || ''}`}
          >
            {layer.element}
          </div>
        );
      })}

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Static Background Component - No scroll animations for better performance
interface ParallaxBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ 
  children, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Removed scroll-based transforms for better performance

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden ${className}`}
    >
      {/* Static Background Layer */}
      <div
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-yellow-400/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-amber-400/4 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Static Section Component - No scroll animations for better performance
interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  direction?: 'up' | 'down';
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  children, 
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Removed scroll-based transforms for better performance

  return (
    <div
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
};

// Static Text Component - No scroll animations for better performance
interface ParallaxTextProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({ 
  children, 
  className = '' 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Removed scroll-based transforms for better performance

  return (
    <div
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
};

export default ParallaxContainer;