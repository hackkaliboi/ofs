
import React, { useEffect, useRef } from "react";

interface GlobeProps {
  size?: number;
  color?: string;
  className?: string;
  dotSize?: number;
  dotDensity?: number;
}

// World map coordinates in a more detailed form for better representation
const WORLD_MAP_COORDS = [
  // North America
  {lat: 40, lng: -100}, {lat: 50, lng: -110}, {lat: 60, lng: -120}, {lat: 45, lng: -90},
  {lat: 35, lng: -80}, {lat: 30, lng: -100}, {lat: 25, lng: -105}, {lat: 20, lng: -105},
  {lat: 37, lng: -95}, {lat: 42, lng: -87}, {lat: 55, lng: -105}, {lat: 32, lng: -95},
  // South America
  {lat: 0, lng: -60}, {lat: -10, lng: -65}, {lat: -20, lng: -60}, {lat: -30, lng: -65},
  {lat: -40, lng: -70}, {lat: -20, lng: -50}, {lat: -10, lng: -55}, {lat: -25, lng: -57},
  {lat: -15, lng: -47}, {lat: -35, lng: -58}, {lat: -5, lng: -45}, {lat: -33, lng: -70},
  // Europe
  {lat: 50, lng: 10}, {lat: 55, lng: 15}, {lat: 60, lng: 20}, {lat: 45, lng: 10}, 
  {lat: 40, lng: 15}, {lat: 55, lng: 5}, {lat: 50, lng: 0}, {lat: 52, lng: 13},
  {lat: 48, lng: 2}, {lat: 41, lng: 12}, {lat: 40, lng: -3}, {lat: 52, lng: -1},
  // Africa
  {lat: 0, lng: 20}, {lat: 10, lng: 10}, {lat: 20, lng: 15}, {lat: 10, lng: 25},
  {lat: -10, lng: 20}, {lat: -20, lng: 25}, {lat: -30, lng: 20}, {lat: 30, lng: 25},
  {lat: 5, lng: 15}, {lat: 15, lng: 30}, {lat: -15, lng: 30}, {lat: -25, lng: 15},
  // Asia
  {lat: 50, lng: 80}, {lat: 60, lng: 90}, {lat: 70, lng: 100}, {lat: 40, lng: 90},
  {lat: 30, lng: 100}, {lat: 20, lng: 110}, {lat: 30, lng: 80}, {lat: 35, lng: 70},
  {lat: 25, lng: 80}, {lat: 39, lng: 116}, {lat: 35, lng: 139}, {lat: 37, lng: 127},
  {lat: 1, lng: 103}, {lat: 23, lng: 120}, {lat: 28, lng: 77}, {lat: 13, lng: 100},
  // Australia and Oceania
  {lat: -25, lng: 135}, {lat: -30, lng: 145}, {lat: -20, lng: 120}, {lat: -30, lng: 130},
  {lat: -33, lng: 151}, {lat: -37, lng: 144}, {lat: -41, lng: 174}, {lat: -18, lng: 178}
];

// Connection hubs - major financial centers
const FINANCIAL_HUBS = [
  {lat: 40.7, lng: -74}, // New York
  {lat: 51.5, lng: -0.1}, // London
  {lat: 35.7, lng: 139.8}, // Tokyo
  {lat: 37.8, lng: -122.4}, // San Francisco
  {lat: 22.3, lng: 114.2}, // Hong Kong
  {lat: 1.3, lng: 103.8}, // Singapore
  {lat: 19.1, lng: 72.9}, // Mumbai
  {lat: -33.9, lng: 151.2}, // Sydney
  {lat: 55.8, lng: 37.6}, // Moscow
  {lat: 52.5, lng: 13.4}, // Berlin
  {lat: 48.9, lng: 2.4}, // Paris
  {lat: 25.2, lng: 55.3}, // Dubai
];

const Globe: React.FC<GlobeProps> = ({ 
  size = 400, 
  color = "#4f46e5",
  className = "",
  dotSize = 2,
  dotDensity = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // For high-resolution displays
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = size * pixelRatio;
    canvas.height = size * pixelRatio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(pixelRatio, pixelRatio);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    
    // Animation variables
    let rotation = 0;
    let animationFrameId: number;
    
    // Create gradient for dots with gold theme
    const dotGradient = ctx.createLinearGradient(0, 0, size, size);
    dotGradient.addColorStop(0, '#FFD700'); // Gold
    dotGradient.addColorStop(0.5, '#FFA500'); // Orange-gold
    dotGradient.addColorStop(1, '#B8860B'); // Dark gold
    
    // Create gradient for connections with gold theme
    const connectionGradient = ctx.createLinearGradient(0, 0, size, size);
    connectionGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)'); // Gold
    connectionGradient.addColorStop(1, 'rgba(184, 134, 11, 0.6)'); // Dark gold
    
    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      
      // Draw the globe background with dark theme
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      const globeGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      globeGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
      globeGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.05)');
      globeGradient.addColorStop(1, 'rgba(255, 215, 0, 0.1)'); // Gold rim
      ctx.fillStyle = globeGradient;
      ctx.fill();
      
      // Add outer glow effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
      const outerGlow = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + 10);
      outerGlow.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
      outerGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = outerGlow;
      ctx.fill();
      
      // Draw grid first (behind the dots)
      drawGrid(rotation);
      
      // Draw world map dots
      drawWorldMap(rotation);
      
      // Draw financial hub connections
      drawFinancialConnections(rotation);
      
      // Draw animated data flow
      drawDataFlow(rotation);
      
      // Increment rotation for animation
      rotation += 0.15;
      if (rotation >= 360) rotation = 0;
      
      // Request next frame
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Draw world map using dots with varying sizes based on importance
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
        const scaleFactor = (z / radius + 1) * dotSize * dotDensity;
        
        // Draw dot
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, scaleFactor, 0, Math.PI * 2);
        ctx.fillStyle = dotGradient;
        ctx.fill();
      });
      
      // Draw financial hubs as larger dots
      FINANCIAL_HUBS.forEach(hub => {
        const phi = (90 - hub.lat) * Math.PI / 180;
        const theta = (hub.lng + rotation) * Math.PI / 180;
        
        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        // Only draw if hub is on the front half of the globe
        if (z < 0) return;
        
        const projectedX = centerX + x;
        const projectedY = centerY + y;
        
        // Draw larger dot for financial hub
        const hubSize = ((z / radius) + 1) * dotSize * 2;
        
        // Enhanced glowing effect for hubs with gold theme
        const gradient = ctx.createRadialGradient(
          projectedX, projectedY, 0,
          projectedX, projectedY, hubSize * 3
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
        gradient.addColorStop(0.3, 'rgba(255, 215, 0, 0.6)');
        gradient.addColorStop(0.7, 'rgba(255, 165, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, hubSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw hub core with pulsing effect
        const pulseIntensity = 0.8 + 0.2 * Math.sin(rotation * 0.1);
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, hubSize * pulseIntensity, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
        
        // Add inner gold ring
        ctx.beginPath();
        ctx.arc(projectedX, projectedY, hubSize * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.fill();
      });
    };
    
    // Draw a subtle grid
    const drawGrid = (rotation: number) => {
      // Draw latitude lines
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
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      
      // Draw longitude lines
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
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    };
    
    // Draw connections between financial hubs
    const drawFinancialConnections = (rotation: number) => {
      // Draw connections between select financial hubs
      for (let i = 0; i < FINANCIAL_HUBS.length; i++) {
        for (let j = i + 1; j < FINANCIAL_HUBS.length; j++) {
          // Skip some connections for cleaner visual (not all hubs connected to all others)
          if (Math.random() > 0.3) continue;
          
          const hub1 = FINANCIAL_HUBS[i];
          const hub2 = FINANCIAL_HUBS[j];
          
          const phi1 = (90 - hub1.lat) * Math.PI / 180;
          const theta1 = (hub1.lng + rotation) * Math.PI / 180;
          const phi2 = (90 - hub2.lat) * Math.PI / 180;
          const theta2 = (hub2.lng + rotation) * Math.PI / 180;
          
          const x1 = -radius * Math.sin(phi1) * Math.cos(theta1);
          const y1 = radius * Math.cos(phi1);
          const z1 = radius * Math.sin(phi1) * Math.sin(theta1);
          
          const x2 = -radius * Math.sin(phi2) * Math.cos(theta2);
          const y2 = radius * Math.cos(phi2);
          const z2 = radius * Math.sin(phi2) * Math.sin(theta2);
          
          // Only draw if at least one hub is visible
          if (z1 < 0 && z2 < 0) continue;
          
          const projX1 = centerX + x1;
          const projY1 = centerY + y1;
          const projX2 = centerX + x2;
          const projY2 = centerY + y2;
          
          ctx.beginPath();
          ctx.moveTo(projX1, projY1);
          
          // Create a curved line (arc) instead of straight line
          const midX = (projX1 + projX2) / 2;
          const midY = (projY1 + projY2) / 2;
          const midZ = (z1 + z2) / 2;
          
          // Add some curve elevation based on distance
          const distance = Math.sqrt(Math.pow(projX2 - projX1, 2) + Math.pow(projY2 - projY1, 2));
          const curveHeight = distance * 0.2;
          const controlX = midX;
          const controlY = midY - curveHeight;
          
          ctx.quadraticCurveTo(controlX, controlY, projX2, projY2);
          
          // Use gradient and adjust opacity based on z position (depth)
          const visibility = Math.min(1, ((z1 + z2) / radius + 2) * 0.3);
          ctx.strokeStyle = connectionGradient;
          ctx.globalAlpha = visibility;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }
    };
    
    // Draw animated data flow along connections
    const drawDataFlow = (rotation: number) => {
      const time = rotation * 0.1; // Use rotation as time parameter
      
      // Loop through only some hub connections to avoid overcrowding
      for (let i = 0; i < FINANCIAL_HUBS.length; i++) {
        // Connect each hub to 2-3 other hubs only
        const connections = 2 + Math.floor(Math.random() * 2);
        for (let c = 0; c < connections; c++) {
          const j = (i + c + 1) % FINANCIAL_HUBS.length;
          
          const hub1 = FINANCIAL_HUBS[i];
          const hub2 = FINANCIAL_HUBS[j];
          
          const phi1 = (90 - hub1.lat) * Math.PI / 180;
          const theta1 = (hub1.lng + rotation) * Math.PI / 180;
          const phi2 = (90 - hub2.lat) * Math.PI / 180;
          const theta2 = (hub2.lng + rotation) * Math.PI / 180;
          
          const x1 = -radius * Math.sin(phi1) * Math.cos(theta1);
          const y1 = radius * Math.cos(phi1);
          const z1 = radius * Math.sin(phi1) * Math.sin(theta1);
          
          const x2 = -radius * Math.sin(phi2) * Math.cos(theta2);
          const y2 = radius * Math.cos(phi2);
          const z2 = radius * Math.sin(phi2) * Math.sin(theta2);
          
          // Only draw if at least one point is on the front half
          if (z1 < 0 && z2 < 0) continue;
          
          const projX1 = centerX + x1;
          const projY1 = centerY + y1;
          const projX2 = centerX + x2;
          const projY2 = centerY + y2;
          
          // Create a curved path
          const midX = (projX1 + projX2) / 2;
          const midY = (projY1 + projY2) / 2;
          const distance = Math.sqrt(Math.pow(projX2 - projX1, 2) + Math.pow(projY2 - projY1, 2));
          const curveHeight = distance * 0.2;
          const controlX = midX;
          const controlY = midY - curveHeight;
          
          // Create a path to place the flow dots on
          let t = (time * 0.5 + i * 0.1) % 1; // Movement amount (0 to 1)
          
          // Calculate position along the quadratic curve
          // P = (1-t)²P₁ + 2(1-t)tP₂ + t²P₃
          const flowX = Math.pow(1-t, 2) * projX1 + 2 * (1-t) * t * controlX + Math.pow(t, 2) * projX2;
          const flowY = Math.pow(1-t, 2) * projY1 + 2 * (1-t) * t * controlY + Math.pow(t, 2) * projY2;
          
          // Draw enhanced data packet with gold theme
          const packetSize = dotSize * (1.5 + 0.3 * Math.sin(time * 2 + i));
          
          // Outer glow
          const glowSize = packetSize * 4;
          const glow = ctx.createRadialGradient(
            flowX, flowY, 0,
            flowX, flowY, glowSize
          );
          glow.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
          glow.addColorStop(0.3, 'rgba(255, 165, 0, 0.6)');
          glow.addColorStop(0.7, 'rgba(255, 215, 0, 0.3)');
          glow.addColorStop(1, 'rgba(255, 215, 0, 0)');
          
          ctx.beginPath();
          ctx.arc(flowX, flowY, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
          
          // Main packet
          ctx.beginPath();
          ctx.arc(flowX, flowY, packetSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.fill();
          
          // Inner gold core
          ctx.beginPath();
          ctx.arc(flowX, flowY, packetSize * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
          ctx.fill();
          
          // Add trailing effect
          for (let trail = 1; trail <= 3; trail++) {
            const trailT = Math.max(0, t - trail * 0.05);
            if (trailT <= 0) continue;
            
            const trailX = Math.pow(1-trailT, 2) * projX1 + 2 * (1-trailT) * trailT * controlX + Math.pow(trailT, 2) * projX2;
            const trailY = Math.pow(1-trailT, 2) * projY1 + 2 * (1-trailT) * trailT * controlY + Math.pow(trailT, 2) * projY2;
            
            ctx.beginPath();
            ctx.arc(trailX, trailY, packetSize * (0.8 - trail * 0.2), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${0.4 - trail * 0.1})`;
            ctx.fill();
          }
          
          ctx.beginPath();
          ctx.arc(flowX, flowY, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }
      }
    };
    
    // Start animation
    draw();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, color, dotSize, dotDensity]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`${className}`} 
      style={{ width: size, height: size }}
    />
  );
};

export default Globe;
