'use client';
import { useEffect, useRef } from 'react';
import { TulipProps } from '../components/types/index';

export default function FlowerAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Tulip implements TulipProps {
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      wobble: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = canvasHeight + Math.random() * 100;
        this.size = Math.random() * 20 + 10;
        this.speed = Math.random() * 2 + 1;
        this.color = `hsl(${Math.random() * 60 + 300}, 70%, 60%)`; // Pink/purple colors
        this.wobble = Math.random() * 2;
      }

      draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.translate(this.x, this.y);
        
        // Stem
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, -this.size * 3);
        context.strokeStyle = '#4CAF50';
        context.lineWidth = 2;
        context.stroke();

        // Flower petals (tulip shape)
        context.beginPath();
        context.ellipse(0, -this.size * 3, this.size, this.size * 1.2, 0, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();

        // Additional petal details
        context.beginPath();
        context.ellipse(-this.size * 0.6, -this.size * 3.2, this.size * 0.4, this.size * 0.8, -0.5, 0, Math.PI * 2);
        context.ellipse(this.size * 0.6, -this.size * 3.2, this.size * 0.4, this.size * 0.8, 0.5, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();

        context.restore();
      }

      update(canvasWidth: number, canvasHeight: number): void {
        this.y -= this.speed;
        this.x += Math.sin(this.y * 0.01) * this.wobble;

        if (this.y < -50) {
          this.y = canvasHeight + 50;
          this.x = Math.random() * canvasWidth;
        }
      }
    }

    const tulips: Tulip[] = [];
    for (let i = 0; i < 20; i++) {
      tulips.push(new Tulip(canvas.width, canvas.height));
    }

    function animate(): void {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      tulips.forEach(tulip => {
        tulip.update(canvas.width, canvas.height);
        tulip.draw(ctx);
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = (): void => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}