'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Volume2, VolumeX, Pause, Play, Home, ChevronRight, Sparkles } from 'lucide-react';

const levels = [
  { id: 1, rows: 2, cols: 3, timeLimit: 60, emojis: ['😀', '😍', '🐶', '🐱', '🐭', '🐹'], pairs: 3 },
  { id: 2, rows: 3, cols: 4, timeLimit: 90, emojis: ['🌟', '⭐', '🌈', '☁️', '🌞', '🌙'], pairs: 6 },
  { id: 3, rows: 4, cols: 4, timeLimit: 120, emojis: ['🎨', '🖌️', '📖', '✏️', '🎵', '🎭', '📚', '🎨'], pairs: 8 },
  { id: 4, rows: 4, cols: 5, timeLimit: 150, emojis: ['🍕', '🍦', '🍎', '🥕', '🍪', '🥛', '🍓', '🍌', '🌮', '🍭'], pairs: 10 },
  { id: 5, rows: 5, cols: 6, timeLimit: 180, emojis: ['🚀', '🪐', '🎪', '🎠', '🏰', '🧸', '🌈', '🦄', '🐉', '🎲', '🛡️', '🏆', '🧿', '🪄', '🌟'], pairs: 15 },
];

const YuyuMemoryMatch = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gamePhase, setGamePhase] = useState('menu'); // menu, playing, levelComplete, gameOver
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stars, setStars] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [mismatchStreak, setMismatchStreak] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [bestScores, setBestScores] = useState({});
  const [earnedStars, setEarnedStars] = useState({});
  const [highestLevel, setHighestLevel] = useState(1);
  const [yuyuMessage, setYuyuMessage] = useState("Hi! Let's play Memory Match! 🐶");

  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Audio
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playSound = (type) => {
    if (isMuted) return;
    const audioCtx = getAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    if (type === 'flip') {
      osc.type = 'sine';
      osc.frequency.value = 600;
      gain.gain.value = 0.1;
    } else if (type === 'match') {
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
      gain.gain.value = 0.2;
    } else if (type === 'mismatch') {
      osc.type = 'sawtooth';
      osc.frequency.value = 400;
      gain.gain.value = 0.15;
    } else if (type === 'win') {
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.8);
      gain.gain.value = 0.25;
    }

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1500;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  };

  // Load progress
  useEffect(() => {
    const savedHighest = localStorage.getItem('yuyuHighestLevel');
    const savedBest = localStorage.getItem('yuyuBestScores');
    const savedStars = localStorage.getItem('yuyuEarnedStars');

    if (savedHighest) setHighestLevel(parseInt(savedHighest));
    if (savedBest) setBestScores(JSON.parse(savedBest));
    if (savedStars) setEarnedStars(JSON.parse(savedStars));
  }, []);

  const saveProgress = (level, newScore, newStars) => {
    const newHighest = Math.max(highestLevel, level + (newStars > 0 ? 1 : 0));
    setHighestLevel(newHighest);
    localStorage.setItem('yuyuHighestLevel', newHighest.toString());

    const updatedBest = { ...bestScores, [level]: Math.max(bestScores[level] || 0, newScore) };
    setBestScores(updatedBest);
    localStorage.setItem('yuyuBestScores', JSON.stringify(updatedBest));

    const updatedStars = { ...earnedStars, [level]: Math.max(earnedStars[level] || 0, newStars) };
    setEarnedStars(updatedStars);
    localStorage.setItem('yuyuEarnedStars', JSON.stringify(updatedStars));
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startLevel = (levelId) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;

    setCurrentLevel(levelId);
    setGamePhase('playing');
    setScore(0);
    setMoves(0);
    setTimeLeft(level.timeLimit);
    setMatchedCards([]);
    setFlippedCards([]);
    setMismatchStreak(0);
    setHintUsed(false);
    setProgress(0);
    setIsPaused(false);

    const cardPairs = [...level.emojis, ...level.emojis];
    const shuffled = shuffleArray(cardPairs);

    const newCards = shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      isMatched: false,
    }));

    setCards(newCards);
    setYuyuMessage("Click any card to start! ✨");
    playSound('click');
  };

  const flipCard = (id) => {
    if (flippedCards.length === 2 || matchedCards.includes(id) || isPaused) return;

    playSound('flip');
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      const card1 = cards.find(c => c.id === first);
      const card2 = cards.find(c => c.id === second);

      if (card1.emoji === card2.emoji) {
        setMatchedCards(prev => [...prev, first, second]);
        setScore(prev => prev + 10);
        setMismatchStreak(0);
        playSound('match');
        setYuyuMessage("Hooray! Amazing match! 🌟");
        setTimeout(() => setFlippedCards([]), 300);
      } else {
        setScore(prev => Math.max(0, prev - 2));
        setMismatchStreak(prev => prev + 1);
        playSound('mismatch');
        setYuyuMessage("Oops! Try again! 💕");
        setTimeout(() => setFlippedCards([]), 800);
      }
    }
  };

  // Timer
  useEffect(() => {
    if (gamePhase === 'playing' && timeLeft > 0 && !isPaused) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gamePhase === 'playing') {
      setGamePhase('gameOver');
      playSound('lose');
      setYuyuMessage("Time's up! But you're still wonderful! 💖");
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gamePhase, isPaused]);

  // Level completion check
  useEffect(() => {
    const level = levels.find(l => l.id === currentLevel);
    if (!level) return;

    if (matchedCards.length === level.pairs * 2) {
      const mismatches = moves - level.pairs;
      let earned = mismatches > 2 ? 1 : mismatches > 0 ? 2 : 3;
      const acc = moves > 0 ? Math.round((level.pairs / moves) * 100) : 100;

      setStars(earned);
      setAccuracy(acc);
      setGamePhase('levelComplete');
      playSound('win');
      saveProgress(currentLevel, score, earned);
      setYuyuMessage(earned === 3 ? "You're a Memory Master! 🎉" : "You did it! Great job! ✨");
    } else {
      setProgress(Math.floor((matchedCards.length / (level.pairs * 2)) * 100));
    }
  }, [matchedCards, currentLevel, score, moves]);

  const cardSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 78 : 100;

  const renderLevelSelect = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#FFDAC1] to-[#FFF8E7] p-6 flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-6xl font-bold text-[#5C4033] mb-3">Yuyu Memory Match</h1>
        <p className="text-2xl text-[#8B5E3C]">Let's train our super memory!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {levels.map(level => {
          const isUnlocked = level.id <= highestLevel;
          const best = bestScores[level.id] || 0;
          const starCount = earnedStars[level.id] || 0;

          return (
            <motion.div
              key={level.id}
              whileHover={isUnlocked ? { scale: 1.05 } : {}}
              className={`bg-white rounded-3xl p-6 shadow-xl border-4 border-[#5C4033] flex flex-col items-center relative ${isUnlocked ? 'cursor-pointer' : 'opacity-70'}`}
              onClick={() => isUnlocked && startLevel(level.id)}
            >
              {!isUnlocked && (
                <div className="absolute top-4 right-4 bg-[#F5F5F5] text-[#8B5E3C] p-2 rounded-full">
                  🔒
                </div>
              )}

              <div className="text-5xl mb-4">Level {level.id}</div>
              <div className="text-[#FFB347] text-2xl font-bold mb-6">{level.rows}×{level.cols}</div>

              <div className="flex gap-1 mb-6">
                {[1,2,3].map(s => (
                  <Star key={s} size={32} className={s <= starCount ? "fill-[#FFB347] text-[#FFB347]" : "text-[#F5F5F5]"} />
                ))}
              </div>

              {best > 0 && <div className="text-sm text-[#8B5E3C] mb-4">Best: {best} pts</div>}

              <button
                disabled={!isUnlocked}
                className="mt-auto w-full py-4 rounded-2xl bg-[#FFB347] text-[#5C4033] font-bold text-xl hover:bg-[#FF9EAA] disabled:bg-gray-300"
              >
                {isUnlocked ? "Play Level →" : "Locked"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderGame = () => {
    const level = levels.find(l => l.id === currentLevel);

    return (
      <div className="min-h-screen bg-[#FFDAC1]">
        {/* HUD */}
        <div className="bg-[#5C4033] text-white py-3 px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <span className="text-2xl">⭐</span>
            <span className="font-bold text-xl">Level {currentLevel}</span>
            <span className="text-[#FFB347] font-bold">Score: {score}</span>
          </div>

          <div className="flex items-center gap-8 text-lg">
            <div>Moves: {moves}</div>
            <div className={`font-mono text-2xl font-bold ${timeLeft < 11 ? 'text-[#FFB347] animate-pulse' : ''}`}>
              {timeLeft}s
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setIsPaused(!isPaused)}>{isPaused ? <Play size={28} /> : <Pause size={28} />}</button>
            <button onClick={() => setIsMuted(!isMuted)}>{isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}</button>
            <button onClick={() => setGamePhase('menu')}><Home size={28} /></button>
          </div>
        </div>

        <div className="h-2 bg-[#F5F5F5]">
          <div className="h-2 bg-[#B5EAD7] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Board */}
        <div className="flex justify-center items-center min-h-[70vh] p-6">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))` }}>
            {cards.map(card => (
              <motion.div
                key={card.id}
                className="relative w-[var(--card-size)] h-[var(--card-size)] cursor-pointer"
                style={{ '--card-size': `${cardSize}px` }}
                onClick={() => flipCard(card.id)}
                animate={{ rotateY: (flippedCards.includes(card.id) || matchedCards.includes(card.id)) ? 180 : 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Back */}
                <div className="absolute inset-0 rounded-3xl border-4 border-[#5C4033] bg-gradient-to-br from-[#FFDAC1] to-[#FFB347] flex items-center justify-center shadow-xl">
                  <span className="text-4xl opacity-40">✨</span>
                </div>

                {/* Front */}
                <div className="absolute inset-0 rounded-3xl border-4 border-[#5C4033] bg-[#FFF8E7] flex items-center justify-center text-6xl shadow-xl rotate-y-180">
                  {card.emoji}
                </div>

                {matchedCards.includes(card.id) && (
                  <div className="absolute -top-2 -right-2 bg-[#B5EAD7] rounded-full p-1">
                    <Sparkles size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Yuyu */}
        <div className="fixed bottom-6 right-6 flex flex-col items-end z-40">
          <div className="bg-[#FF9EAA] text-[#5C4033] px-6 py-3 rounded-3xl rounded-br-none max-w-[280px] shadow-xl mb-3 text-lg">
            {yuyuMessage}
          </div>
          <div className="w-28 h-28 bg-white rounded-3xl border-4 border-[#5C4033] flex items-center justify-center text-7xl shadow-2xl">
            🐶
          </div>
        </div>
      </div>
    );
  };

  const renderLevelComplete = () => {
    const isNewBest = score > (bestScores[currentLevel] || 0);

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 max-w-md w-full text-center border-8 border-[#FFB347]"
        >
          <h2 className="text-5xl font-bold text-[#5C4033]">Level {currentLevel} Complete!</h2>
          <p className="text-3xl my-6">🎉 Congratulations! 🎉</p>

          <div className="flex justify-center gap-4 mb-8">
            {[1,2,3].map(s => (
              <Star key={s} size={64} className={s <= stars ? "fill-[#FFB347] text-[#FFB347]" : "text-gray-300"} />
            ))}
          </div>

          <div className="bg-[#FFF8E7] p-6 rounded-2xl text-left space-y-3 mb-8 text-xl">
            <div>Score: <span className="font-bold text-[#FFB347]">{score}</span></div>
            <div>Accuracy: {accuracy}%</div>
            {isNewBest && <div className="text-[#B5EAD7] font-bold">✨ New Best Score! ✨</div>}
          </div>

          <div className="space-y-4">
            {currentLevel < 5 && (
              <button onClick={() => startLevel(currentLevel + 1)} className="w-full py-5 bg-[#FFB347] text-[#5C4033] font-bold text-2xl rounded-2xl">
                Next Level →
              </button>
            )}
            <button onClick={() => startLevel(currentLevel)} className="w-full py-5 bg-[#5C4033] text-white font-bold rounded-2xl">
              Play Again
            </button>
            <button onClick={() => setGamePhase('menu')} className="w-full py-4 text-[#8B5E3C]">
              Back to Levels
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      {gamePhase === 'menu' && renderLevelSelect()}
      {gamePhase === 'playing' && renderGame()}
      {gamePhase === 'levelComplete' && renderLevelComplete()}
    </div>
  );
};

export default YuyuMemoryMatch;