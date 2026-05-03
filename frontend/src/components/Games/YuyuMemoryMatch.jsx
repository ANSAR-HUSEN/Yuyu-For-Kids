import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ArrowLeft, RefreshCw, Trophy, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const YuyuMemoryMatch = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gamePhase, setGamePhase] = useState('menu');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stars, setStars] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [childId, setChildId] = useState(null);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [yuyuMessage, setYuyuMessage] = useState("Hi! Let's play Memory Match! 🎮");

  const timerRef = useRef(null);

  const levels = [
    { id: 1, rows: 2, cols: 3, timeLimit: 60, emojis: ['😀', '😍', '🐶', '🐱', '🐭', '🐹'], pairs: 3 },
    { id: 2, rows: 3, cols: 4, timeLimit: 90, emojis: ['🌟', '⭐', '🌈', '☁️', '🌞', '🌙'], pairs: 6 },
    { id: 3, rows: 4, cols: 4, timeLimit: 120, emojis: ['🎨', '🖌️', '📖', '✏️', '🎵', '🎭', '📚', '🎨'], pairs: 8 },
    { id: 4, rows: 4, cols: 5, timeLimit: 150, emojis: ['🍕', '🍦', '🍎', '🥕', '🍪', '🥛', '🍓', '🍌', '🌮', '🍭'], pairs: 10 },
    { id: 5, rows: 5, cols: 6, timeLimit: 180, emojis: ['🚀', '🪐', '🎪', '🎠', '🏰', '🧸', '🌈', '🦄', '🐉', '🎲', '🛡️', '🏆', '🧿', '🪄', '🌟'], pairs: 15 },
  ];

  useEffect(() => {
    const storedChildId = localStorage.getItem('currentChildId');
    if (storedChildId) {
      setChildId(storedChildId);
      loadGameProgress(storedChildId);
    }
    
    const savedHighScore = localStorage.getItem('memoryMatchHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  const loadGameProgress = async (childId) => {
    try {
      const result = await api.getGameProgress(childId, 'memory_match');
      if (result && result.level) {
        setCurrentLevel(result.level || 1);
        setTotalXP(result.exp || 0);
        setHighScore(result.highScore || 0);
      }
      
      const stats = await api.getChildStats(childId);
      if (stats && stats.child) {
        setTotalXP(stats.child.totalPoints || 0);
      }
    } catch (error) {
      console.error('Error loading game progress:', error);
    }
  };

  const saveProgress = async (pointsEarned, newLevel, finalScore) => {
    if (!childId || isSaving) return;
    
    setIsSaving(true);
    try {
      const result = await api.saveGameProgress(childId, 'memory_match', {
        score: finalScore,
        pointsEarned: pointsEarned,
        level: newLevel,
        movesUsed: moves,
        timeSpent: 0,
        metadata: { stars: stars }
      });
      
      if (result) {
        setTotalXP(result.totalXP);
        
        if (result.badges && result.badges.length > 0) {
          result.badges.forEach(badge => {
            showBadgeNotification(badge);
          });
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const showBadgeNotification = (badge) => {
    setCurrentBadge(badge);
    setShowBadgePopup(true);
    setTimeout(() => setShowBadgePopup(false), 3000);
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startLevel = async (levelId) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;

    setCurrentLevel(levelId);
    setGamePhase('playing');
    setScore(0);
    setMoves(0);
    setTimeLeft(level.timeLimit);
    setMatchedCards([]);
    setFlippedCards([]);
    setProgress(0);
    setIsPaused(false);
    setStars(0);
    setShowLevelComplete(false);

    const cardPairs = [...level.emojis, ...level.emojis];
    const shuffled = shuffleArray(cardPairs);

    const newCards = shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      isMatched: false,
    }));

    setCards(newCards);
    setYuyuMessage(`Level ${levelId}! Find all the matching pairs! 🌟`);
  };

  const flipCard = (id) => {
    if (flippedCards.length === 2 || matchedCards.includes(id) || isPaused || showLevelComplete) return;

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
        setYuyuMessage("Great match! Keep going! 🎉");
        setTimeout(() => setFlippedCards([]), 300);
      } else {
        setScore(prev => Math.max(0, prev - 2));
        setYuyuMessage("Not a match! Try again! 💪");
        setTimeout(() => setFlippedCards([]), 800);
      }
    }
  };

  useEffect(() => {
    if (gamePhase === 'playing' && timeLeft > 0 && !isPaused && !showLevelComplete) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gamePhase === 'playing') {
      setGamePhase('gameOver');
      setYuyuMessage("Time's up! Want to try again? ⏰");
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gamePhase, isPaused, showLevelComplete]);

  useEffect(() => {
    const level = levels.find(l => l.id === currentLevel);
    if (!level) return;

    if (matchedCards.length === level.pairs * 2 && !showLevelComplete) {
      const mismatches = moves - level.pairs;
      let earned = mismatches > 2 ? 1 : mismatches > 0 ? 2 : 3;
      const acc = moves > 0 ? Math.round((level.pairs / moves) * 100) : 100;

      setStars(earned);
      setAccuracy(acc);
      setShowLevelComplete(true);
      setGamePhase('levelComplete');
      
      const pointsEarned = (level.pairs * 10) + (earned * 20);
      const newScore = score + pointsEarned;
      setScore(newScore);
      
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('memoryMatchHighScore', newScore);
      }
      
      const newHighest = Math.max(currentLevel, currentLevel + 1);
      localStorage.setItem('memoryMatchHighestLevel', newHighest.toString());
      
      saveProgress(pointsEarned, currentLevel + 1, newScore);
      setYuyuMessage(earned === 3 ? "Perfect! You're a memory master! 🏆" : "Level complete! Great job! 🌟");
    } else {
      setProgress(Math.floor((matchedCards.length / (level.pairs * 2)) * 100));
    }
  }, [matchedCards, currentLevel]);

  const resetGame = () => {
    setScore(0);
    setMoves(0);
    setMatchedCards([]);
    setFlippedCards([]);
    setProgress(0);
    setTimeLeft(levels.find(l => l.id === currentLevel)?.timeLimit || 60);
    setShowLevelComplete(false);
    setGamePhase('playing');
    
    const level = levels.find(l => l.id === currentLevel);
    if (level) {
      const cardPairs = [...level.emojis, ...level.emojis];
      const shuffled = shuffleArray(cardPairs);
      const newCards = shuffled.map((emoji, index) => ({
        id: index,
        emoji,
        isMatched: false,
      }));
      setCards(newCards);
    }
  };

  const nextLevel = () => {
    if (currentLevel < 5) {
      startLevel(currentLevel + 1);
    } else {
      setGamePhase('menu');
      setShowLevelComplete(false);
    }
  };

  const cardSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 70 : 90;

  const renderLevelSelect = () => (
    <div className="min-h-screen bg-gradient-to-br from-peach to-cream p-6 flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-5xl mb-6">
        <button 
          onClick={() => navigate('/kids-dashboard')}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-peach text-warmBrown hover:text-softPink transition-colors"
        >
          <ArrowLeft size={18} className="rotate-180" />
          <span className="font-medium">Back</span>
        </button>
        <div className="flex items-center gap-2 bg-blush rounded-full px-4 py-2 shadow-md">
          <Award size={16} className="text-gold" />
          <span className="font-bold text-darkBrown text-sm">{totalXP} XP</span>
        </div>
      </div>
      
      <div className="text-center mb-10">
        <h1 className="text-6xl font-bold text-darkBrown mb-3">Memory Match</h1>
        <p className="text-2xl text-warmBrown">Train your brain with Yuyu!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {levels.map(level => {
          const completed = false;

          return (
            <motion.div
              key={level.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-3xl p-6 shadow-xl border-4 border-gold flex flex-col items-center cursor-pointer"
              onClick={() => startLevel(level.id)}
            >
              <div className="text-5xl mb-4">Level {level.id}</div>
              <div className="text-marine text-2xl font-bold mb-6">{level.rows}×{level.cols}</div>
              <div className="flex gap-1 mb-6">
                {[1,2,3].map(s => (
                  <Star key={s} size={32} className="text-gold" />
                ))}
              </div>
              <button className="mt-auto w-full py-4 rounded-2xl bg-gold text-darkBrown font-bold text-xl hover:bg-softPink transition-colors">
                Play Level →
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
      <div className="min-h-screen bg-gradient-to-br from-peach to-cream">
        <div className="bg-darkMarine text-white py-3 px-6 flex items-center justify-between sticky top-0 z-50 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <button onClick={() => setGamePhase('menu')} className="p-2 rounded-full hover:bg-white/20">
              <ArrowLeft size={24} />
            </button>
            <span className="text-2xl">🎮</span>
            <span className="font-bold text-xl">Level {currentLevel}</span>
            <span className="text-gold font-bold">Score: {score}</span>
          </div>

          <div className="flex items-center gap-6 text-lg">
            <div>Moves: {moves}</div>
            <div className={`font-mono text-2xl font-bold ${timeLeft < 11 ? 'text-gold animate-pulse' : ''}`}>
              {timeLeft}s
            </div>
            <div className="flex items-center gap-2 bg-blush px-3 py-1 rounded-full">
              <Award size={16} className="text-gold" />
              <span className="font-bold text-darkBrown text-sm">{totalXP} XP</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setIsPaused(!isPaused)} className="p-2 rounded-full hover:bg-white/20">
              {isPaused ? "▶️" : "⏸️"}
            </button>
            <button onClick={resetGame} className="p-2 rounded-full hover:bg-white/20">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        <div className="h-2 bg-cream">
          <div className="h-2 bg-gold transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="fixed top-24 right-4 bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-md z-40">
          <div className="flex gap-1">
            {[1,2,3].map(s => (
              <Star key={s} size={20} className={s <= stars ? "fill-gold text-gold" : "text-gray-300"} />
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center min-h-[70vh] p-6">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))` }}>
            {cards.map(card => (
              <motion.div
                key={card.id}
                className="relative w-[var(--card-size)] h-[var(--card-size)] cursor-pointer"
                style={{ '--card-size': `${cardSize}px` }}
                onClick={() => flipCard(card.id)}
                animate={{ rotateY: (flippedCards.includes(card.id) || matchedCards.includes(card.id)) ? 180 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 rounded-2xl border-4 border-darkMarine bg-gradient-to-br from-gold to-softPink flex items-center justify-center shadow-xl">
                  <span className="text-4xl opacity-40">?</span>
                </div>
                <div className="absolute inset-0 rounded-2xl border-4 border-darkMarine bg-cream flex items-center justify-center text-5xl shadow-xl rotate-y-180">
                  {card.emoji}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-6 right-6 flex flex-col items-end z-40">
          <div className="bg-softPink text-white px-5 py-2 rounded-2xl rounded-br-none max-w-[220px] shadow-xl mb-2 text-sm">
            {yuyuMessage}
          </div>
          <div className="w-16 h-16 bg-white rounded-2xl border-4 border-darkMarine flex items-center justify-center text-4xl shadow-2xl">
            🐶
          </div>
        </div>
      </div>
    );
  };

  const renderLevelCompleteModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-cream rounded-3xl p-8 max-w-md w-full text-center border-8 border-gold"
      >
        <h2 className="text-4xl font-bold text-darkBrown">Level {currentLevel} Complete!</h2>
        <p className="text-2xl my-4">🎉 Congratulations! 🎉</p>

        <div className="flex justify-center gap-3 mb-6">
          {[1,2,3].map(s => (
            <Star key={s} size={50} className={s <= stars ? "fill-gold text-gold" : "text-gray-300"} />
          ))}
        </div>

        <div className="bg-peach p-5 rounded-2xl text-left space-y-2 mb-6">
          <div className="text-darkBrown">Score: <span className="font-bold text-gold">{score}</span></div>
          <div className="text-darkBrown">Accuracy: {accuracy}%</div>
          <div className="text-darkBrown">Moves: {moves}</div>
        </div>

        <div className="space-y-3">
          {currentLevel < 5 && (
            <button onClick={nextLevel} className="w-full py-4 bg-gold text-darkBrown font-bold text-xl rounded-2xl">
              Next Level →
            </button>
          )}
          <button onClick={resetGame} className="w-full py-3 bg-darkMarine text-white font-bold rounded-2xl">
            Play Again
          </button>
          <button onClick={() => setGamePhase('menu')} className="w-full py-2 text-warmBrown">
            Back to Levels
          </button>
        </div>
      </motion.div>
    </div>
  );

  const renderGameOverModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-cream rounded-3xl p-8 max-w-md w-full text-center border-8 border-softPink"
      >
        <h2 className="text-4xl font-bold text-darkBrown">Game Over</h2>
        <p className="text-2xl my-4">😢 Time's up! 😢</p>
        <div className="bg-peach p-5 rounded-2xl mb-6">
          <div className="text-darkBrown text-xl">Your Score: <span className="font-bold text-gold">{score}</span></div>
        </div>
        <div className="space-y-3">
          <button onClick={() => startLevel(currentLevel)} className="w-full py-3 bg-gold text-darkBrown font-bold rounded-2xl">
            Try Again
          </button>
          <button onClick={() => setGamePhase('menu')} className="w-full py-2 text-warmBrown">
            Back to Levels
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="font-sans">
      <AnimatePresence>
        {showBadgePopup && currentBadge && (
          <motion.div
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: -50, opacity: 0 }}
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-gold to-softPink rounded-2xl px-8 py-6 shadow-2xl border-4 border-cream text-center">
              <Trophy size={48} className="text-white mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">Badge Earned!</p>
              <p className="text-xl text-white mt-1">{currentBadge.name}</p>
              <p className="text-sm text-white/90 mt-1">+{currentBadge.xpBonus} XP</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {gamePhase === 'menu' && renderLevelSelect()}
      {gamePhase === 'playing' && renderGame()}
      {gamePhase === 'levelComplete' && showLevelComplete && renderLevelCompleteModal()}
      {gamePhase === 'gameOver' && renderGameOverModal()}
    </div>
  );
};

export default YuyuMemoryMatch;