
import React, { useEffect, useRef } from "react";

interface GlobeProps {
  size?: number;
  color?: string;
  className?: string;
}

// World map coordinates in a simplified form
const WORLD_MAP_COORDS = [
  // North America
  {lat: 40, lng: -100}, {lat: 50, lng: -110}, {lat: 60, lng: -120}, {lat: 45, lng: -90},
  {lat: 35, lng: -80}, {lat: 30, lng: -100}, {lat: 25, lng: -105}, {lat: 20, lng: -105},
  // South America
  {lat: 0, lng: -60}, {lat: -10, lng: -65}, {lat: -20, lng: -60}, {lat: -30, lng: -65},
  {lat: -40, lng: -70}, {lat: -20, lng: -50}, {lat: -10, lng: -55},
  // Europe
  {lat: 50, lng: 10}, {lat: 55, lng: 15}, {lat: 60, lng: 20}, {lat: 45, lng: 10}, 
  {lat: 40, lng: 15}, {lat: 55, lng: 5}, {lat: 50, lng: 0},
  // Africa
  {lat: 0, lng: 20}, {lat: 10, lng: 10}, {lat: 20, lng: 15}, {lat: 10, lng: 25},
  {lat: -10, lng: 20}, {lat: -20, lng: 25}, {lat: -30, lng: 20}, {lat: 30, lng: 25},
  // Asia
  {lat: 50, lng: 80}, {lat: 60, lng: 90}, {lat: 70, lng: 100}, {lat: 40, lng: 90},
  {lat: 30, lng: 100}, {lat: 20, lng: 110}, {lat: 30, lng: 80}, {lat: 35, lng: 70},
  {lat: 25, lng: 80},
  // Australia
  {lat: -25, lng: 135}, {lat: -30, lng: 145}, {lat: -20, lng: 120}, {lat: -30, lng: 130}
];

const Globe: React.FC<GlobeProps> = ({ 
  size = 300, 
  color = "#4f46e5",
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
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, '#7E69AB'); // Secondary color
    
    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      
      // Draw the globe background with subtle opacity
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fill();
      
      // Draw world map dots
      drawWorldMap(rotation);
      
      // Draw latitude and longitude lines
      drawGrid(rotation);
      
      // Increment rotation for animation
      rotation += 0.2;
      if (rotation >= 360) rotation = 0;
      
      // Request next frame
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Draw world map using dots
    const drawWorldMap = (rotation: number) => {
      WORLD_MAP_COORDS.forEach(coord => {
        // Convert lat/lng to 3D coordinates
        const phi = (90 - coord.lat) * Math.PI / 180;
        const theta = (coord.lng + rotation) * Math.PI / 180;
        
        // Calculate 3D position
        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        // Only draw if point is on the front half of the globe
        if (z < 0) return;
        
        // Project to 2D
        const projectedX = centerX + x;
        const projectedY = centerY + y;
        
        // Calculate dot size based on z-coordinate (perspective)
        const dotSize = (z / radius + 1) * 1.5;
        
        // Draw dot
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };
    
    // Draw a subtle grid
    const drawGrid = (rotation: number) => {
      // Draw some latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        for (let lng = 0; lng < 360; lng += 5) {
          const phi = (90 - lat) * Math.PI / 180;
          const theta = (lng + rotation) * Math.PI / 180;
          
          const x = -radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          
          if (lng === 0) {
            ctx.moveTo(centerX + x, centerY + y);
          } else {
            ctx.lineTo(centerX + x, centerY + y);
          }
        }
        ctx.strokeStyle = 'rgba(79, 70, 229, 0.1)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      
      // Draw some longitude lines
      for (let lng = 0; lng < 360; lng += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
          const phi = (90 - lat) * Math.PI / 180;
          const theta = (lng + rotation) * Math.PI / 180;
          
          const x = -radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          
          if (lat === -90) {
            ctx.moveTo(centerX + x, centerY + y);
          } else {
            ctx.lineTo(centerX + x, centerY + y);
          }
        }
        ctx.strokeStyle = 'rgba(79, 70, 229, 0.1)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
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
