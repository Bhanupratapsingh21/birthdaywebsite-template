'use client';
import { useState, useEffect } from 'react';
import { getTimeUntilBirthday } from '../utils/dateCheck';
import { TimeLeft } from './types/index';
import FlowerAnimation from '../components/FlowerAnimation';
import { BackgroundGradientAnimation } from './ui/background-gradient-animation';
import { homepageContent } from '@/data';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeUntilBirthday());
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Update countdown timer every second
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilBirthday());
    }, 1000);

    // Update current time every second
    const updateTime = () => {
      const now = new Date();

      // Get IST time (UTC + 5:30)
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istTime = new Date(utc + (5.5 * 60 * 60 * 1000));

      const timeString = istTime.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      setCurrentTime(timeString);
    };

    updateTime(); // Initial call
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <BackgroundGradientAnimation>
      <div className="flex justify-center items-center min-h-screen">
        <FlowerAnimation />

        <div className="countdown-content">
          <h1>Counting Down to Your Special Day!</h1>
          <p>My love, I can&apos;t wait to celebrate you on {homepageContent.date}!</p>

          <div className="countdown-grid">
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.days}</span>
              <span className="countdown-label">Days</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.hours}</span>
              <span className="countdown-label">Hours</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.minutes}</span>
              <span className="countdown-label">Minutes</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.seconds}</span>
              <span className="countdown-label">Seconds</span>
            </div>
          </div>

          {/* Additional Debug Info */}
          <div className="mt-8 text-center">
            <div className="text-white/70 text-sm">

            </div>
          </div>
        </div>

        <style jsx>{`
        .countdown-container {
        
        }

        .countdown-content {
          text-align: center;
          color: white;
          z-index: 2;
          position: relative;
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        p {
          font-size: 1.5rem;
          margin-bottom: 3rem;
          opacity: 0.9;
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .countdown-item {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 2rem 1rem;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .countdown-number {
          font-size: 3rem;
          font-weight: bold;
          display: block;
        }

        .countdown-label {
          font-size: 1rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .floating-hearts {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .floating-heart {
          position: absolute;
          font-size: 2rem;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        @media (max-width: 768px) {
          h1 { font-size: 2rem; }
          p { font-size: 1.2rem; }
          .countdown-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .countdown-number { font-size: 2rem; }
        }
      `}</style>
      </div>
    </BackgroundGradientAnimation>
  );
}