'use client';
import { useEffect, useState } from 'react';
import { isBirthdayDate } from '@/utils/dateCheck';
import CountdownTimer from '@/components/CountdownTimer';
import Link from 'next/link';
import { homepageContent } from '@/data';

export default function Home() {
  const [isBirthday, setIsBirthday] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    setIsBirthday(isBirthdayDate());
  }, []);

  if (!isClient) {
    return (
      <div className="loading-screen">
        <div className="loader-container">
          <div className="floating-hearts">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="heart" style={{ animationDelay: `${i * 0.5}s` }}>💖</div>
            ))}
          </div>
          <div className="loader-text">Preparing something special...</div>
        </div>
      </div>
    );
  }

  return (
    <main>
      {isBirthday ? (
        <div className="birthday-redirect">
          {/* Animated Background */}
          <div className="animated-background" />
          
          {/* Floating Elements */}
          <div className="floating-elements">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="floating-emoji"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  fontSize: `${Math.random() * 2 + 1.5}rem`
                }}
              >
                {['🎉', '🎂', '🎁', '✨', '💖', '🌸', '⭐', '🎈', '🥳', '🎊', '💝', '🌹'][i]}
              </div>
            ))}
          </div>

          <div className="redirect-content">
            <div className="content-card">
              <div className="icon-container">
                <div className="sparkle">✨</div>
                <div className="main-emoji">🎉</div>
                <div className="sparkle">✨</div>
              </div>
              
              <h1 className="main-title">{homepageContent.title}</h1>
              <p className="subtitle">{homepageContent.description}</p>
              
              <div className="message-box">
                <p className="welcome-message">
                  Get ready for an unforgettable experience filled with love and surprises!
                </p>
              </div>

              <Link href="/birthday" className="celebrate-button">
                <span className="button-text">{homepageContent.buttonText}</span>
                <span className="button-emoji">{homepageContent.buttonEmoji}</span>
                <div className="button-glow"></div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <CountdownTimer />
      )}

      <style jsx>{`
        .loading-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .loader-container {
          text-align: center;
          position: relative;
        }

        .floating-hearts {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 100px;
        }

        .heart {
          position: absolute;
          font-size: 1.5rem;
          animation: heartFloat 3s ease-in-out infinite;
          opacity: 0;
        }

        .loader-text {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-top: 4rem;
          animation: pulse 2s ease-in-out infinite;
        }

        .birthday-redirect {
          min-height: 100vh;
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 50%, #a8e6cf 100%);
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .animated-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .floating-emoji {
          position: absolute;
          animation: floatAround 8s ease-in-out infinite;
          opacity: 0.7;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }

        .redirect-content {
          text-align: center;
          color: white;
          z-index: 2;
          position: relative;
        }

        .content-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          box-shadow: 
            0 25px 50px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.3);
          animation: cardEntrance 1s ease-out;
          max-width: 500px;
          margin: 0 auto;
        }

        .icon-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .sparkle {
          font-size: 2rem;
          animation: sparkle 2s ease-in-out infinite;
          opacity: 0.8;
        }

        .main-emoji {
          font-size: 4rem;
          animation: bounce 2s ease-in-out infinite;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
          text-shadow: 0 4px 12px rgba(0,0,0,0.3);
          background: linear-gradient(135deg, #fff, #ffeaea, #fff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.4rem;
          margin: 0 0 2rem 0;
          opacity: 0.9;
          font-weight: 500;
        }

        .message-box {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          margin: 2rem 0;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .welcome-message {
          font-size: 1.1rem;
          margin: 0;
          line-height: 1.6;
          opacity: 0.9;
        }

        .celebrate-button {
          background: linear-gradient(135deg, #fff, #ffeaea);
          color: #ff6b6b;
          padding: 1.3rem 2.5rem;
          font-size: 1.3rem;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 700;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          position: relative;
          overflow: hidden;
          border: none;
          cursor: pointer;
          box-shadow: 
            0 8px 25px rgba(255, 255, 255, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.2);
        }

        .celebrate-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 
            0 15px 35px rgba(255, 255, 255, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.3);
        }

        .celebrate-button:active {
          transform: translateY(-1px) scale(1.02);
        }

        .button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          transition: left 0.6s ease;
        }

        .celebrate-button:hover .button-glow {
          left: 100%;
        }

        /* Animations */
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes floatAround {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          66% { transform: translateY(-10px) translateX(-10px) rotate(-5deg); }
        }

        @keyframes heartFloat {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
          100% { transform: translateY(-60px) rotate(360deg); opacity: 0; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .content-card {
            padding: 2rem 1.5rem;
            margin: 1rem;
          }

          .main-title {
            font-size: 2.8rem;
          }

          .subtitle {
            font-size: 1.2rem;
          }

          .main-emoji {
            font-size: 3rem;
          }

          .sparkle {
            font-size: 1.5rem;
          }

          .celebrate-button {
            padding: 1.1rem 2rem;
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .main-title {
            font-size: 2.2rem;
          }

          .subtitle {
            font-size: 1.1rem;
          }

          .content-card {
            padding: 1.5rem 1rem;
          }

          .celebrate-button {
            padding: 1rem 1.8rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </main>
  );
}