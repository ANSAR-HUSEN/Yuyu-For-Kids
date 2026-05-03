import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ArrowLeft, RefreshCw, Circle, Square, Triangle, Hexagon, Star as StarIcon, Heart as HeartIcon, Moon, Sun, Cloud, Apple, Trophy, Zap, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const YuyuShapeSorter = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [currentShape, setCurrentShape] = useState(null);
  const [shapeHoles, setShapeHoles] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [combo, setCombo] = useState(0);
  const [wrongMessage, setWrongMessage] = useState('');
  const [totalXP, setTotalXP] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [childId, setChildId] = useState(null);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(null);

  const allShapes = [
    { name: 'circle', icon: Circle, color: 'text-pink-500', bgColor: 'bg-pink-100', borderColor: 'border-pink-400' },
    { name: 'square', icon: Square, color: 'text-blue-500', bgColor: 'bg-blue-100', borderColor: 'border-blue-400' },
    { name: 'triangle', icon: Triangle, color: 'text-yellow-500', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-400' },
    { name: 'hexagon', icon: Hexagon, color: 'text-orange-500', bgColor: 'bg-orange-100', borderColor: 'border-orange-400' },
    { name: 'star', icon: StarIcon, color: 'text-red-500', bgColor: 'bg-red-100', borderColor: 'border-red-400' },
    { name: 'heart', icon: HeartIcon, color: 'text-red-500', bgColor: 'bg-red-100', borderColor: 'border-red-400' },
    { name: 'moon', icon: Moon, color: 'text-indigo-500', bgColor: 'bg-indigo-100', borderColor: 'border-indigo-400' },
    { name: 'sun', icon: Sun, color: 'text-orange-500', bgColor: 'bg-orange-100', borderColor: 'border-orange-400' },
    { name: 'cloud', icon: Cloud, color: 'text-cyan-500', bgColor: 'bg-cyan-100', borderColor: 'border-cyan-400' },
    { name: 'apple', icon: Apple, color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-500' },
  ];

  useEffect(() => {
    const storedChildId = localStorage.getItem('currentChildId');
    if (storedChildId) {
      setChildId(storedChildId);
      loadGameProgress(storedChildId);
    }
    
    const savedHighScore = localStorage.getItem('shapeSorterHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    initializeLevel();
  }, []);

  const loadGameProgress = async (childId) => {
    try {
      const result = await api.getGameProgress(childId, 'shape_sorter');
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
      const result = await api.saveGameProgress(childId, 'shape_sorter', {
        score: finalScore,
        pointsEarned: pointsEarned,
        level: newLevel,
        movesUsed: 0,
        timeSpent: 0,
        metadata: { combo: combo }
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

  const initializeLevel = () => {
    let numShapes = 2;
    if (level >= 2) numShapes = 3;
    if (level >= 3) numShapes = 4;
    if (level >= 4) numShapes = 5;
    if (level >= 5) numShapes = 6;
    if (level >= 7) numShapes = 7;
    if (level >= 9) numShapes = 8;
    if (level >= 12) numShapes = 9;
    if (level >= 15) numShapes = 10;

    const selectedShapes = [...allShapes].sort(() => 0.5 - Math.random()).slice(0, numShapes);
    setShapeHoles(selectedShapes);
    selectRandomShape(selectedShapes);
  };

  const selectRandomShape = (shapes) => {
    if (!shapes || shapes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * shapes.length);
    setCurrentShape(shapes[randomIndex]);
  };

  const handleShapeClick = (clickedShape, index) => {
    if (showSuccess || showWrong || isSaving) return;

    if (clickedShape.name === currentShape.name) {
      handleCorrect(index);
    } else {
      handleWrong(clickedShape.name);
    }
  };

  const handleCorrect = async (matchedIndex) => {
    setShowSuccess(true);
    
    const pointsEarned = 10 + (combo * 2);
    const newScore = score + pointsEarned;
    setScore(newScore);
    setCombo(combo + 1);
    
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('shapeSorterHighScore', newScore);
    }
    
    const newLevel = Math.floor(newScore / 100) + 1;
    let levelUpsCount = 0;
    
    if (newLevel > level && newLevel <= 20) {
      levelUpsCount = newLevel - level;
      setLevel(newLevel);
    }
    
    await saveProgress(pointsEarned + (levelUpsCount * 50), newLevel, newScore);
    
    setTimeout(() => {
      setShowSuccess(false);
      const updatedHoles = shapeHoles.filter((_, idx) => idx !== matchedIndex);
      
      if (updatedHoles.length === 0) {
        const newNumShapes = Math.min(2 + Math.floor((newLevel || level) / 2), 10);
        const newShapes = [...allShapes].sort(() => 0.5 - Math.random()).slice(0, newNumShapes);
        setShapeHoles(newShapes);
        selectRandomShape(newShapes);
      } else {
        setShapeHoles(updatedHoles);
        selectRandomShape(updatedHoles);
      }
    }, 600);
  };

  const handleWrong = async (wrongShapeName) => {
    setWrongMessage(`That's a ${wrongShapeName}! Find the ${currentShape.name}!`);
    setShowWrong(true);
    const newLives = lives - 1;
    setLives(newLives);
    setCombo(0);
    
    await saveProgress(0, level, score);
    
    setTimeout(() => {
      setShowWrong(false);
      if (newLives === 0) {
        saveProgress(0, level, score);
      }
    }, 1500);
  };

  const resetGame = async () => {
    await saveProgress(0, level, score);
    
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    setShapeHoles([]);
    setCurrentShape(null);
    setShowSuccess(false);
    setShowWrong(false);
    setTimeout(() => {
      initializeLevel();
    }, 100);
  };

  const ShapeIcon = ({ shape, className }) => {
    const IconComponent = shape.icon;
    return <IconComponent className={className} />;
  };

  return (
    <div className="min-h-screen bg-softPink/10 overflow-hidden">
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
            <span className="font-bold text-xl text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>
              Shape Sorter
            </span>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {shapeHoles.length > 0 && currentShape && (
          <>
            <div className="text-center mb-6">
              <div className="inline-block bg-cream/80 backdrop-blur rounded-full px-6 py-2">
                <p className="text-warmBrown font-bold">
                  Level {level}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
              {shapeHoles.map((hole, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShapeClick(hole, idx)}
                  className={`${hole.bgColor} border-4 ${hole.borderColor} rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:shadow-xl`}
                >
                  <ShapeIcon shape={hole} className={`w-16 h-16 md:w-20 md:h-20 ${hole.color}`} />
                  <span className={`text-sm font-bold ${hole.color} capitalize`}>{hole.name}</span>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <div className="inline-block">
                <div className="bg-white rounded-full p-8 inline-block shadow-xl border-4 border-softPink">
                  <ShapeIcon shape={currentShape} className="w-32 h-32 md:w-40 md:h-40 text-softPink" />
                </div>
              </div>
            </div>
          </>
        )}

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
          {showSuccess && !showBadgePopup && (
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -50 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-gold rounded-2xl px-8 py-6 shadow-2xl border-4 border-cream">
                <p className="text-3xl md:text-4xl font-bold text-cream whitespace-nowrap">
                  Perfect Match! +{10 + (combo * 2)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showWrong && (
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -50 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-softPink rounded-2xl px-8 py-6 shadow-2xl border-4 border-cream max-w-md">
                <p className="text-2xl md:text-3xl font-bold text-cream text-center">
                  {wrongMessage}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {lives === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-darkBrown/70 flex items-center justify-center z-50"
          >
            <div className="bg-cream rounded-3xl p-8 text-center max-w-md mx-4">
              <h2 className="text-3xl font-bold text-darkBrown mb-2">Game Over</h2>
              <p className="text-warmBrown mb-4">You reached Level {level} with {score} points!</p>
              {score === highScore && score > 0 && (
                <p className="text-gold font-bold mb-4">New High Score! 🏆</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={resetGame}
                  className="flex-1 px-4 py-3 bg-softPink text-cream rounded-xl font-bold"
                >
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/kids-dashboard')}
                  className="flex-1 px-4 py-3 bg-cream text-darkBrown rounded-xl font-bold border border-peach"
                >
                  Exit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default YuyuShapeSorter;