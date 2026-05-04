import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ArrowLeft, RefreshCw, Trophy, Award, Target, Zap, Eye, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const YuyuMemoryMatch = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [childId, setChildId] = useState(null);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState('');
  const [gameActive, setGameActive] = useState(true);
  
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [memoryRound, setMemoryRound] = useState(1);
  const [showingSequence, setShowingSequence] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [bestRound, setBestRound] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);

  const colors = [
    { id: 0, name: 'red', value: '#EF4444', icon: '🔴' },
    { id: 1, name: 'blue', value: '#3B82F6', icon: '💙' },
    { id: 2, name: 'green', value: '#10B981', icon: '💚' },
    { id: 3, name: 'yellow', value: '#F59E0B', icon: '💛' },
    { id: 4, name: 'purple', value: '#8B5CF6', icon: '🟣' }
  ];

  useEffect(() => {
    const storedChildId = localStorage.getItem('currentChildId');
    if (storedChildId) {
      setChildId(storedChildId);
      loadGameProgress(storedChildId);
    }
    
    const savedHighScore = localStorage.getItem('memoryMatchHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    
    const savedBestRound = localStorage.getItem('memoryMatchBestRound');
    if (savedBestRound) setBestRound(parseInt(savedBestRound));
    
    startNewRound();
  }, []);

  const loadGameProgress = async (childId) => {
    try {
      const result = await api.getGameProgress(childId, 'memory_match');
      if (result && result.level) {
        setLevel(result.level || 1);
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
        movesUsed: memoryRound,
        timeSpent: 0,
        metadata: { bestRound: bestRound }
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
    showMessageFunc(`🏆 ${badge.name}! +${badge.xpBonus} XP`, 'win');
  };

  const showMessageFunc = (msg, type) => {
    setMessageText(msg);
    setMessageType(type);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500);
  };

  const playSequence = async (seq) => {
    setIsPlayingSequence(true);
    setShowingSequence(true);
    
    for (let i = 0; i < seq.length; i++) {
      setHighlightedIndex(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
      setHighlightedIndex(-1);
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    
    setIsPlayingSequence(false);
    setShowingSequence(false);
  };

  const startNewRound = () => {
    const newColorId = Math.floor(Math.random() * colors.length);
    const newSequence = [...sequence, newColorId];
    setSequence(newSequence);
    setUserSequence([]);
    playSequence(newSequence);
  };

  const handleColorClick = (colorId) => {
    if (showingSequence || isPlayingSequence || !gameActive) return;
    
    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);
    
    if (colorId !== sequence[newUserSequence.length - 1]) {
      handleWrong();
      return;
    }
    
    if (newUserSequence.length === sequence.length) {
      handleCorrect();
    }
  };

  const handleCorrect = async () => {
    const roundBonus = memoryRound * 10;
    const comboBonus = combo * 2;
    const basePoints = 20;
    const pointsEarned = basePoints + roundBonus + comboBonus;
    
    const newScore = score + pointsEarned;
    setScore(newScore);
    setCombo(prev => prev + 1);
    
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('memoryMatchHighScore', newScore);
    }
    
    const newRound = memoryRound + 1;
    setMemoryRound(newRound);
    
    if (newRound > bestRound) {
      setBestRound(newRound);
      localStorage.setItem('memoryMatchBestRound', newRound.toString());
      showMessageFunc(`New Record: Round ${newRound}! 🎉`, 'win');
    }
    
    const newLevel = Math.floor(newScore / 200) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      showMessageFunc(`Level ${newLevel}! 🌟`, 'level');
      await saveProgress(pointsEarned, newLevel, newScore);
    } else {
      await saveProgress(pointsEarned, level, newScore);
    }
    
    showMessageFunc(`+${pointsEarned} XP! Round ${newRound}`, 'win');
    startNewRound();
  };

  const handleWrong = async () => {
    const newLives = lives - 1;
    setLives(newLives);
    setCombo(0);
    
    await saveProgress(0, level, score);
    showMessageFunc('Wrong sequence! Try again! 💪', 'lose');
    
    if (newLives === 0) {
      setGameActive(false);
      await saveProgress(0, level, score);
    } else {
      setSequence([]);
      setUserSequence([]);
      setMemoryRound(1);
      startNewRound();
    }
  };

  const resetGame = async () => {
    await saveProgress(0, level, score);
    
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    setSequence([]);
    setUserSequence([]);
    setMemoryRound(1);
    setGameActive(true);
    startNewRound();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-softPink/20 to-peach/20 overflow-hidden">
      <nav className="relative z-20 px-6 py-4 md:px-12 lg:px-24 flex justify-between items-center bg-cream/80 backdrop-blur-md shadow-sm rounded-full mx-6 mt-4 border border-peach">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/kids-dashboard')}
            className="flex items-center gap-2 text-darkBrown hover:text-softPink transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium hidden md:inline">Exit Game</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-softPink flex items-center justify-center">
              <span className="text-cream font-bold text-lg">Y</span>
            </div>
            <span className="font-bold text-xl text-darkBrown">Memory Match</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-lightYellow rounded-full px-3 py-1.5">
            <Star size={16} className="text-gold fill-gold" />
            <span className="font-bold text-darkBrown text-sm">{score}</span>
          </div>
          <div className="flex items-center gap-2 bg-cream rounded-full px-3 py-1.5">
            <Heart size={16} className="text-softPink fill-softPink" />
            <span className="font-bold text-darkBrown text-sm">{lives}</span>
          </div>
          <div className="flex items-center gap-2 bg-lightYellow rounded-full px-3 py-1.5">
            <Zap size={14} className="text-gold" />
            <span className="font-bold text-gold text-xs">x{combo}</span>
          </div>
          <div className="flex items-center gap-2 bg-blush rounded-full px-3 py-1.5">
            <Award size={14} className="text-gold" />
            <span className="font-bold text-darkBrown text-xs">{totalXP} XP</span>
          </div>
          <button onClick={resetGame} className="p-2 rounded-full hover:bg-cream transition-colors">
            <RefreshCw size={18} className="text-warmBrown" />
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-cream/80 backdrop-blur rounded-full px-6 py-2 mb-4">
            <p className="text-warmBrown font-bold text-lg">
              Round {memoryRound} • Best: {bestRound}
            </p>
          </div>
          
          {showingSequence && (
            <div className="bg-gold/20 rounded-2xl px-6 py-3 inline-block">
              <p className="text-darkBrown font-bold text-xl flex items-center gap-2">
                <Eye size={24} className="text-gold" />
                Watch the sequence!
                <Eye size={24} className="text-gold" />
              </p>
            </div>
          )}
          
          {!showingSequence && !isPlayingSequence && gameActive && (
            <div className="bg-mint/20 rounded-2xl px-6 py-3 inline-block">
              <p className="text-darkBrown font-bold text-xl flex items-center gap-2">
                <Play size={24} className="text-marine" />
                Your turn! Repeat the sequence!
                <Target size={24} className="text-marine" />
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-6 flex-wrap">
          {colors.map((color) => (
            <motion.button
              key={color.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleColorClick(color.id)}
              disabled={showingSequence || isPlayingSequence || !gameActive}
              className={`w-28 h-28 rounded-2xl shadow-xl text-5xl flex items-center justify-center transition-all duration-200 ${
                !showingSequence && !isPlayingSequence && gameActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
              } ${highlightedIndex === color.id ? 'ring-8 ring-gold ring-offset-4 scale-110' : ''}`}
              style={{ backgroundColor: color.value }}
              animate={highlightedIndex === color.id ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.2 }}
            >
              {color.icon}
            </motion.button>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="inline-block bg-cream/80 backdrop-blur rounded-full px-4 py-2">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-gold" />
              <span className="text-sm text-warmBrown">Sequence Length:</span>
              <span className="text-xl font-bold text-darkBrown">{sequence.length}</span>
            </div>
          </div>
        </div>

        {!gameActive && (
          <div className="text-center mt-12">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={resetGame}
              className="px-8 py-4 bg-gold text-darkBrown rounded-2xl font-bold text-xl hover:bg-softPink transition-colors shadow-lg flex items-center gap-2 mx-auto"
            >
              <Play size={24} />
              Play Again
            </motion.button>
          </div>
        )}
      </div>

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

      <AnimatePresence>
        {showMessage && !showBadgePopup && (
          <motion.div
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: -50, opacity: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className={`rounded-2xl px-8 py-6 shadow-2xl border-4 border-cream ${
              messageType === 'win' ? 'bg-gold' :
              messageType === 'lose' ? 'bg-softPink' :
              messageType === 'level' ? 'bg-mint' : 'bg-peach'
            }`}>
              <p className="text-3xl md:text-4xl font-bold text-cream whitespace-nowrap text-center">
                {messageText}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YuyuMemoryMatch;