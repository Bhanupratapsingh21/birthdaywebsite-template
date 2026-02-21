'use client';
import FlowerAnimation from './FlowerAnimation';

export default function CelebrationHero() {
  const handleSurpriseClick = (): void => {
    alert('I love you more than words can say! 💕');
  };

  return (
    <div className="celebration-container">
      <FlowerAnimation />

      <div className="celebration-content">
        <div className="birthday-message">
          <h1 className="main-title">Happy Birthday My Universe — pihu 💖</h1>
          <p className="subtitle">October , 2025 - Your Special Day!</p>

          <div className="message-box">
            <p className="love-message">
              Today is all about you — the most special person in my life.
              Every smile of yours makes my world brighter, every word from you feels like a melody.
              This website is my small way of showing how deeply you’re loved, cared for, and cherished… always.💖
            </p>
          </div>

          <div className="surprise-button">
            <button onClick={handleSurpriseClick}>
              Click for a Surprise!
            </button>
          </div>
        </div>
      </div>

      <div className="floating-elements">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="floating-element"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 2 + 1}rem`
            }}
          >
            🎂🎁🎈💖🌸
          </div>
        ))}
      </div>

      <style jsx>{`
        .celebration-container {
          min-height: 100vh;
          background: linear-gradient(45deg, #ff6b6b, #ffa8a8, #ffd8d8);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          animation: gradientShift 8s ease-in-out infinite;
          background-size: 200% 200%;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .celebration-content {
          text-align: center;
          color: #fff;
          z-index: 2;
          position: relative;
        }

        .main-title {
          font-size: 4rem;
          margin-bottom: 1rem;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .subtitle {
          font-size: 1.8rem;
          margin-bottom: 3rem;
          opacity: 0.9;
        }

        .message-box {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: 20px;
          margin: 2rem 0;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .love-message {
          font-size: 1.4rem;
          line-height: 1.6;
          margin: 0;
        }

        .surprise-button button {
          background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
          border: none;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          color: white;
          border-radius: 50px;
          cursor: pointer;
          transition: transform 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .surprise-button button:hover {
          transform: scale(1.1);
        }

        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .floating-element {
          position: absolute;
          animation: floatAround 8s ease-in-out infinite;
          opacity: 0.7;
        }

        @keyframes floatAround {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
          }
          25% { 
            transform: translate(100px, -50px) rotate(90deg); 
          }
          50% { 
            transform: translate(50px, -100px) rotate(180deg); 
          }
          75% { 
            transform: translate(-50px, -50px) rotate(270deg); 
          }
        }

        @media (max-width: 768px) {
          .main-title { font-size: 2.5rem; }
          .subtitle { font-size: 1.3rem; }
          .love-message { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
}