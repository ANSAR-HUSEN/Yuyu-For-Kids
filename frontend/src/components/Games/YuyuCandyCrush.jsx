import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ArrowLeft, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const YuyuCandyCrush = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [movesLeft, setMovesLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  const candies = ['🍬', '🍬', '🍬', '🍬', '🍬', '🍬'];
  const candyColors = [
    'bg-red-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-orange-500'
  ];

  useEffect(() => {
    const saved = localStorage.getItem('candyHighScore');
    if (saved) setHighScore(parseInt(saved));
    initBoard();
  }, []);

  const getCandyCount = () => {
    if (level <= 2) return 3;
    if (level <= 4) return 4;
    if (level <= 6) return 5;
    return 6;
  };

  const getRandomCandy = () => {
    return Math.floor(Math.random() * getCandyCount());
  };

  const initBoard = () => {
    const newBoard = [];
    for (let i = 0; i < 5; i++) {
      newBoard[i] = [];
      for (let j = 0; j < 5; j++) {
        newBoard[i][j] = getRandomCandy();
      }
    }
    
    let hasMatch = true;
    while (hasMatch) {
      hasMatch = false;
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
          if (newBoard[i][j] === newBoard[i][j+1] && newBoard[i][j] === newBoard[i][j+2]) {
            newBoard[i][j] = getRandomCandy();
            newBoard[i][j+1] = getRandomCandy();
            newBoard[i][j+2] = getRandomCandy();
            hasMatch = true;
          }
        }
      }
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 5; j++) {
          if (newBoard[i][j] === newBoard[i+1][j] && newBoard[i][j] === newBoard[i+2][j]) {
            newBoard[i][j] = getRandomCandy();
            newBoard[i+1][j] = getRandomCandy();
            newBoard[i+2][j] = getRandomCandy();
            hasMatch = true;
          }
        }
      }
    }
    setBoard(newBoard);
  };

  const checkMatches = (currentBoard) => {
    const matches = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === currentBoard[i][j+1] && currentBoard[i][j] === currentBoard[i][j+2]) {
          matches.push([i, j], [i, j+1], [i, j+2]);
          let k = j+3;
          while (k < 5 && currentBoard[i][k] === currentBoard[i][j]) {
            matches.push([i, k]);
            k++;
          }
        }
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        if (currentBoard[i][j] === currentBoard[i+1][j] && currentBoard[i][j] === currentBoard[i+2][j]) {
          matches.push([i, j], [i+1, j], [i+2, j]);
          let k = i+3;
          while (k < 5 && currentBoard[k][j] === currentBoard[i][j]) {
            matches.push([k, j]);
            k++;
          }
        }
      }
    }
    return matches;
  };

  const dropCandies = (currentBoard) => {
    const newBoard = [...currentBoard.map(row => [...row])];
    for (let j = 0; j < 5; j++) {
      const column = [];
      for (let i = 4; i >= 0; i--) {
        if (newBoard[i][j] !== null) {
          column.push(newBoard[i][j]);
        }
      }
      while (column.length < 5) {
        column.push(getRandomCandy());
      }
      for (let i = 0; i < 5; i++) {
        newBoard[4 - i][j] = column[i];
      }
    }
    return newBoard;
  };

  const processMatches = async (currentBoard) => {
    let newBoard = [...currentBoard.map(row => [...row])];
    let totalPoints = 0;
    let hasMatches = true;
    
    while (hasMatches) {
      const matches = checkMatches(newBoard);
      if (matches.length === 0) {
        hasMatches = false;
        break;
      }
      
      totalPoints += matches.length * 5;
      
      for (let [i, j] of matches) {
        newBoard[i][j] = null;
      }
      
      newBoard = dropCandies(newBoard);
    }
    
    if (totalPoints > 0) {
      const newScore = score + totalPoints;
      setScore(newScore);
      showMessageFunc(`+${totalPoints} points!`, 'win');
      
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('candyHighScore', newScore);
      }
      
      const newLevel = Math.floor(newScore / 100) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setMovesLeft(15);
        showMessageFunc(`Level ${newLevel}!`, 'level');
      }
    }
    
    return newBoard;
  };

  const handleCandyClick = async (row, col) => {
    if (gameOver) return;
    
    if (selectedRow === null) {
      setSelectedRow(row);
      setSelectedCol(col);
    } else {
      const isAdjacent = (Math.abs(selectedRow - row) + Math.abs(selectedCol - col)) === 1;
      
      if (isAdjacent) {
        const newBoard = [...board.map(r => [...r])];
        const temp = newBoard[selectedRow][selectedCol];
        newBoard[selectedRow][selectedCol] = newBoard[row][col];
        newBoard[row][col] = temp;
        
        const matches = checkMatches(newBoard);
        
        if (matches.length > 0) {
          setBoard(newBoard);
          const newMoves = movesLeft - 1;
          setMovesLeft(newMoves);
          
          const processedBoard = await processMatches(newBoard);
          setBoard(processedBoard);
          
          if (newMoves <= 0) {
            setGameOver(true);
            showMessageFunc('Game Over!', 'lose');
          }
        }
        
        setSelectedRow(null);
        setSelectedCol(null);
      } else {
        setSelectedRow(row);
        setSelectedCol(col);
      }
    }
  };

  const showMessageFunc = (msg, type) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setMovesLeft(15);
    setGameOver(false);
    setSelectedRow(null);
    setSelectedCol(null);
    initBoard();
  };

  const playSound = (type) => {
    if (!soundOn) return;
    console.log(`Sound: ${type}`);
  };

  const getCandyColor = (candyId) => {
    return candyColors[candyId % candyColors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-softPink/20 to-peach/20">
      <nav className="relative z-20 px-6 py-4 md:px-12 lg:px-24 flex justify-between items-center bg-cream/80 backdrop-blur-md shadow-sm rounded-full mx-6 border border-peach">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/kids-dashboard')} className="flex items-center gap-2 text-darkBrown hover:text-softPink">
            <ArrowLeft size={20} />
            <span className="font-medium hidden md:inline">Exit Game</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-softPink flex items-center justify-center">
              <span className="text-cream font-bold text-lg">Y</span>
            </div>
            <span className="font-bold text-xl text-darkBrown">Candy Crush</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-lightYellow rounded-full px-4 py-2">
            <Star size={20} className="text-gold fill-gold" />
            <span className="font-bold text-darkBrown">{score}</span>
          </div>
          <div className="flex items-center gap-2 bg-cream rounded-full px-4 py-2">
            <span className="font-bold text-warmBrown">🎯 {Math.floor(score / 100) * 100 + 100}</span>
          </div>
          <div className="flex items-center gap-2 bg-lightYellow rounded-full px-4 py-2">
            <span className="font-bold text-gold">🎮 {movesLeft}</span>
          </div>
          <button onClick={resetGame} className="p-2 rounded-full hover:bg-cream">
            <RefreshCw size={20} className="text-warmBrown" />
          </button>
          <button onClick={() => setSoundOn(!soundOn)} className="p-2 rounded-full hover:bg-cream">
            {soundOn ? <Volume2 size={20} className="text-warmBrown" /> : <VolumeX size={20} className="text-warmBrown" />}
          </button>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="text-center mb-4">
          <div className="inline-block bg-cream/80 rounded-full px-6 py-2">
            <p className="text-warmBrown font-bold">Level {level} • {movesLeft} moves left</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 bg-white/20 rounded-3xl p-4 shadow-2xl">
          {board.map((row, i) => (
            row.map((candy, j) => (
              <motion.button
                key={`${i}-${j}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCandyClick(i, j)}
                className={`aspect-square rounded-xl shadow-lg transition-all ${getCandyColor(candy)} ${
                  selectedRow === i && selectedCol === j ? 'ring-4 ring-gold scale-105' : ''
                }`}
              >
                <div className="w-full h-full flex items-center justify-center text-3xl drop-shadow-lg">
                  🍬
                </div>
              </motion.button>
            ))
          ))}
        </div>

    
      </div>

      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-gold rounded-2xl px-8 py-6 shadow-2xl border-4 border-cream">
              <p className="text-3xl font-bold text-cream text-center">{message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {gameOver && (
        <div className="fixed inset-0 bg-darkBrown/70 flex items-center justify-center z-50">
          <div className="bg-cream rounded-3xl p-8 text-center max-w-md mx-4">
            <h2 className="text-3xl font-bold text-darkBrown mb-2">Game Over</h2>
            <p className="text-warmBrown mb-4">Level {level} • Score: {score}</p>
            {score === highScore && score > 0 && (
              <p className="text-gold font-bold mb-4">New High Score! 🏆</p>
            )}
            <div className="flex gap-3">
              <button onClick={resetGame} className="flex-1 px-4 py-3 bg-softPink text-cream rounded-xl font-bold">
                Play Again
              </button>
              <button onClick={() => navigate('/dashboard')} className="flex-1 px-4 py-3 bg-cream text-darkBrown rounded-xl font-bold border border-peach">
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YuyuCandyCrush;