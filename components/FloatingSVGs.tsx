'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface FloatingElement {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  floatSpeed: number;
  rotationSpeed: number;
}

export default function FloatingSVGs() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Create floating elements for SVG files 1-10
    const svgElements: FloatingElement[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      src: `/svg/${i + 1}.svg`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.7, // Random scale between 0.5 and 1.2
      floatSpeed: 0.5 + Math.random() * 1.5, // Random speed
      rotationSpeed: (Math.random() - 0.5) * 2 // Random rotation speed
    }));

    setElements(svgElements);
  }, []);

  return (
    <div className="floating-container">
      {elements.map((element) => (
        <div
          key={element.id}
          className="floating-element"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
            animation: `float ${10 / element.floatSpeed}s ease-in-out infinite, 
                       rotate ${20 / element.rotationSpeed}s linear infinite`
          }}
        >
          <Image
            src={element.src}
            alt={`Decoration ${element.id}`}
            width={150}
            height={150}
            className="svg-image"
          />
        </div>
      ))}
      
      <style jsx>{`
        .floating-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .floating-element {
          position: absolute;
          pointer-events: none;
          transition: transform 0.3s ease;
        }

        .svg-image {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
          opacity: 0.9;
          transition: all 0.3s ease;
        }

        .floating-element:hover .svg-image {
          opacity: 1;
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.15));
          transform: scale(1.05);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(var(--rotation, 0deg)) scale(var(--scale, 1));
          }
          50% {
            transform: translateY(-20px) rotate(calc(var(--rotation, 0deg) + 5deg)) scale(var(--scale, 1));
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg) scale(var(--scale, 1));
          }
          100% {
            transform: rotate(360deg) scale(var(--scale, 1));
          }
        }
      `}</style>
    </div>
  );
}