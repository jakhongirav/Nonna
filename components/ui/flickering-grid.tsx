"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FlickeringGridProps {
  className?: string;
  squareSize?: number;
  gridGap?: number;
  color?: string;
  maxOpacity?: number;
  flickerChance?: number;
}

export function FlickeringGrid({
  className,
  squareSize = 4,
  gridGap = 6,
  color = "#6B7280",
  maxOpacity = 0.5,
  flickerChance = 0.1,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Initial size
    updateDimensions();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensions.width || !dimensions.height) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const squares: { x: number; y: number; opacity: number }[] = [];
    const totalSquaresX = Math.floor(dimensions.width / (squareSize + gridGap));
    const totalSquaresY = Math.floor(dimensions.height / (squareSize + gridGap));

    // Initialize squares
    for (let y = 0; y < totalSquaresY; y++) {
      for (let x = 0; x < totalSquaresX; x++) {
        squares.push({
          x: x * (squareSize + gridGap),
          y: y * (squareSize + gridGap),
          opacity: Math.random() * maxOpacity,
        });
      }
    }

    function animate() {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      ctx.fillStyle = color;

      squares.forEach((square) => {
        if (Math.random() < flickerChance) {
          square.opacity = Math.random() * maxOpacity;
        }
        ctx.globalAlpha = square.opacity;
        ctx.fillRect(square.x, square.y, squareSize, squareSize);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Cleanup if needed
    };
  }, [dimensions, squareSize, gridGap, color, maxOpacity, flickerChance]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 w-full h-full", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
} 