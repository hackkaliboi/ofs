
import React, { useEffect, useRef } from "react";

interface GlobeProps {
  size?: number;
  color?: string;
  className?: string;
}

const Globe: React.FC<GlobeProps> = ({ 
  size = 300, 
  color = "#3b82f6",
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = size;
    canvas.height = size;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    
    // Animation variables
    let rotation = 0;
    let animationFrameId: number;
    
    // Create a gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, '#1e40af');
    
    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      
      // Draw the globe background
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fill();
      
      // Draw horizontal latitude lines
      for (let i = -80; i <= 80; i += 20) {
        drawLatitude(i);
      }
      
      // Draw vertical longitude lines
      for (let i = 0; i < 360; i += 20) {
        drawLongitude(i + rotation);
      }
      
      // Increment rotation for animation
      rotation += 0.2;
      if (rotation >= 360) rotation = 0;
      
      // Request next frame
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Draw a latitude circle
    const drawLatitude = (lat: number) => {
      const latRadius = radius * Math.cos(lat * Math.PI / 180);
      const y = centerY + radius * Math.sin(lat * Math.PI / 180);
      
      ctx.beginPath();
      ctx.arc(centerX, y, latRadius, 0, Math.PI * 2);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };
    
    // Draw a longitude arc
    const drawLongitude = (lng: number) => {
      ctx.beginPath();
      
      for (let lat = -90; lat <= 90; lat += 5) {
        const latRadius = radius * Math.cos(lat * Math.PI / 180);
        const y = centerY + radius * Math.sin(lat * Math.PI / 180);
        const x = centerX + latRadius * Math.cos(lng * Math.PI / 180);
        
        if (lat === -90) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };
    
    // Start animation
    draw();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, color]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`${className}`} 
      style={{ width: size, height: size }}
    />
  );
};

export default Globe;
