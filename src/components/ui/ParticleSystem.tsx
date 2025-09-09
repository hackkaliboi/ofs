import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleSystemProps {
  particleCount?: number;
  mouseInteraction?: boolean;
  className?: string;
  colors?: string[];
  connectionDistance?: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particleCount = 20,
  mouseInteraction = true,
  className = '',
  colors = ['#fbbf24', '#f59e0b', '#d97706', '#92400e'],
  connectionDistance = 60
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100
      });
    }
    
    particlesRef.current = particles;
  };

  // Update particle positions and properties
  const updateParticles = (width: number, height: number) => {
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    
    particles.forEach((particle) => {
      // Mouse interaction
      if (mouseInteraction && mouse.isMoving) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx += (dx / distance) * force * 0.01;
          particle.vy += (dy / distance) * force * 0.01;
        }
      }
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Boundary collision with bounce
      if (particle.x <= 0 || particle.x >= width) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      if (particle.y <= 0 || particle.y >= height) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }
      
      // Apply friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Update life and opacity
      particle.life += 1;
      if (particle.life > particle.maxLife) {
        particle.life = 0;
        particle.x = Math.random() * width;
        particle.y = Math.random() * height;
        particle.vx = (Math.random() - 0.5) * 0.5;
        particle.vy = (Math.random() - 0.5) * 0.5;
      }
      
      // Breathing opacity effect
      particle.opacity = 0.2 + 0.3 * Math.sin(particle.life * 0.05);
    });
  };

  // Draw particles and connections
  const drawParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const particles = particlesRef.current;
    
    // Draw connections
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.2;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    // Draw particles
    particles.forEach((particle) => {
      ctx.globalAlpha = particle.opacity;
      
      // Create gradient for particle
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    
    ctx.globalAlpha = 1;
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = dimensions;
    
    updateParticles(width, height);
    drawParticles(ctx, width, height);
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle mouse movement
  const handleMouseMove = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      isMoving: true
    };
    
    // Reset mouse movement flag after a delay
    setTimeout(() => {
      mouseRef.current.isMoving = false;
    }, 100);
  };

  // Handle resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const parent = canvas.parentElement;
    if (!parent) return;
    
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    setDimensions({ width, height });
    initParticles(width, height);
  };

  useEffect(() => {
    handleResize();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Add event listeners
    if (mouseInteraction) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (canvas && mouseInteraction) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [dimensions.width, dimensions.height]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

export default ParticleSystem;