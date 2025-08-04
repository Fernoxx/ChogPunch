import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GameUIProps {
  playerHealth: number;
  playerMaxHealth: number;
  playerEnergy: number;
  playerMaxEnergy: number;
  score: number;
  combo: number;
  maxCombo: number;
  timeLeft: number;
  playerName: string;
  playerAvatar?: string;
  specialMovesReady: string[];
}

export const GameUI: React.FC<GameUIProps> = ({
  playerHealth,
  playerMaxHealth,
  playerEnergy,
  playerMaxEnergy,
  score,
  combo,
  maxCombo,
  timeLeft,
  playerName,
  playerAvatar,
  specialMovesReady
}) => {
  const healthPercentage = (playerHealth / playerMaxHealth) * 100;
  const energyPercentage = (playerEnergy / playerMaxEnergy) * 100;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 30 }}>
      {/* Top UI Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4">
          
          {/* Player Info */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              {playerAvatar ? (
                <Image
                  src={playerAvatar}
                  alt={playerName}
                  fill
                  className="rounded-lg border-2 border-yellow-400 object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 rounded-lg border-2 border-yellow-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {playerName[0]}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-1 rounded">
                LV.{Math.floor(score / 1000) + 1}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">{playerName}</h3>
              
              {/* Health Bar */}
              <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
                <motion.div
                  className="absolute inset-y-0 left-0 health-bar"
                  animate={{ width: `${healthPercentage}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold drop-shadow-lg">
                    {playerHealth} / {playerMaxHealth}
                  </span>
                </div>
                {/* Health bar shine effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent" />
              </div>
              
              {/* Energy Bar */}
              <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mt-1 border border-gray-600">
                <motion.div
                  className="absolute inset-y-0 left-0 energy-bar"
                  animate={{ width: `${energyPercentage}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
                {/* Energy particles */}
                {energyPercentage > 50 && (
                  <div className="absolute inset-0">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-300 rounded-full"
                        animate={{
                          x: [0, 100, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.5,
                          repeat: Infinity
                        }}
                        style={{ left: `${i * 30}%`, top: '50%' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timer and Score */}
          <div className="text-center">
            <motion.div
              className="text-4xl font-bold text-white mb-1"
              animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: timeLeft <= 10 ? Infinity : 0 }}
              style={{
                color: timeLeft <= 30 ? '#ff6b6b' : '#ffffff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {formatTime(timeLeft)}
            </motion.div>
            
            <div className="bg-black/60 rounded-lg px-3 py-1 inline-block">
              <p className="text-yellow-400 font-bold text-xl">
                {score.toLocaleString()}
              </p>
              <p className="text-gray-400 text-xs">SCORE</p>
            </div>
          </div>

          {/* Combo Counter */}
          <div className="text-right">
            <AnimatePresence>
              {combo > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="inline-block"
                >
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg px-4 py-2 border-2 border-yellow-400">
                    <p className="text-white text-xs">COMBO</p>
                    <p className="text-3xl font-bold text-yellow-300">
                      x{combo}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {maxCombo > 0 && (
              <p className="text-gray-400 text-sm mt-1">
                Best: x{maxCombo}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Special Moves Indicators */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <div className="space-y-2">
          {['uppercut', 'roundhouse', 'special'].map((move, index) => {
            const isReady = specialMovesReady.includes(move);
            return (
              <motion.div
                key={move}
                className={`w-16 h-16 rounded-lg border-2 ${
                  isReady ? 'border-yellow-400 bg-yellow-400/20' : 'border-gray-600 bg-gray-800/50'
                }`}
                animate={{
                  scale: isReady ? [1, 1.1, 1] : 1,
                  boxShadow: isReady ? [
                    '0 0 0 0 rgba(250, 204, 21, 0)',
                    '0 0 20px 10px rgba(250, 204, 21, 0.3)',
                    '0 0 0 0 rgba(250, 204, 21, 0)'
                  ] : '0 0 0 0 rgba(250, 204, 21, 0)'
                }}
                transition={{
                  duration: 1.5,
                  repeat: isReady ? Infinity : 0
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className={`text-2xl ${isReady ? 'text-yellow-400' : 'text-gray-600'}`}>
                    {move === 'uppercut' ? '↗' : move === 'roundhouse' ? '🌀' : '⚡'}
                  </span>
                </div>
                <p className={`text-xs text-center mt-1 ${isReady ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {index + 1}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Hit Streak Indicator */}
      <AnimatePresence>
        {combo >= 5 && (
          <motion.div
            className="absolute top-40 left-1/2 transform -translate-x-1/2"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 blur-xl animate-pulse" />
              <div className="relative bg-black/80 px-6 py-3 rounded-lg border-2 border-yellow-400">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  {combo >= 20 ? 'GODLIKE!' : 
                   combo >= 15 ? 'UNSTOPPABLE!' : 
                   combo >= 10 ? 'AMAZING!' : 
                   'GREAT!'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Energy Full Indicator */}
      <AnimatePresence>
        {energyPercentage >= 100 && (
          <motion.div
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 rounded-full">
              <p className="text-white font-bold">ENERGY FULL!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Low Health Warning */}
      <AnimatePresence>
        {healthPercentage < 30 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent" />
            <motion.div
              className="absolute inset-0 border-8 border-red-600"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                borderWidth: ['8px', '12px', '8px']
              }}
              transition={{
                duration: 1,
                repeat: Infinity
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};