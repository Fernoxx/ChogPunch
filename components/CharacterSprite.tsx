import React from 'react';
import Image from 'next/image';

interface CharacterSpriteProps {
  x: number;
  y: number;
  facing: 1 | -1;
  isRunning: boolean;
  isJumping: boolean;
  isFalling: boolean;
}

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  x,
  y,
  facing,
  isRunning,
  isJumping,
  isFalling
}) => {
  let animationClass = 'idle';
  
  if (isJumping) {
    animationClass = 'jump';
  } else if (isFalling) {
    animationClass = 'fall';
  } else if (isRunning) {
    animationClass = 'run';
  }

  return (
    <div
      className={`character-sprite ${animationClass}`}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: `scaleX(${facing})`,
        width: '32px',
        height: '32px',
      }}
    >
      <style jsx>{`
        .character-sprite {
          transition: left 0.05s linear, top 0.05s linear;
          transform-origin: center;
        }

        .character-sprite img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          image-rendering: pixelated;
        }

        /* Idle animation - subtle breathing */
        .character-sprite.idle img {
          animation: idle 2s ease-in-out infinite;
        }

        @keyframes idle {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(-1px) scaleY(0.98); }
        }

        /* Running animation - Mario-style run cycle */
        .character-sprite.run img {
          animation: run 0.4s steps(4) infinite;
        }

        @keyframes run {
          0% { 
            transform: translateY(0px) rotate(-2deg);
          }
          25% { 
            transform: translateY(-2px) rotate(0deg);
          }
          50% { 
            transform: translateY(0px) rotate(2deg);
          }
          75% { 
            transform: translateY(-2px) rotate(0deg);
          }
          100% { 
            transform: translateY(0px) rotate(-2deg);
          }
        }

        /* Jump animation */
        .character-sprite.jump img {
          animation: jump 0.3s ease-out forwards;
        }

        @keyframes jump {
          0% { 
            transform: translateY(0px) scaleY(0.9) scaleX(1.1);
          }
          100% { 
            transform: translateY(-5px) scaleY(1.1) scaleX(0.9);
          }
        }

        /* Fall animation */
        .character-sprite.fall img {
          animation: fall 0.3s ease-in forwards;
        }

        @keyframes fall {
          0% { 
            transform: translateY(-5px) scaleY(1.1) scaleX(0.9);
          }
          100% { 
            transform: translateY(0px) scaleY(0.9) scaleX(1.1);
          }
        }
      `}</style>
      <Image
        src="/chog.png"
        alt="Character"
        width={32}
        height={32}
        priority
      />
    </div>
  );
};