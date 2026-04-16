import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ArrowLeft, Volume2, VolumeX, RefreshCw, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const YuyuTicTacToe = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const [combo, setCombo] = useState(0);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  useEffect(() => {
    const savedHighScore = localStorage.getItem('tictactoeHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    resetBoard();
  }, []);

  const playSound = (type) => {
    if (!soundOn) return;
    console.log(`Playing sound: ${type}`);
  };

  const showMessage = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const checkWinner = (currentBoard) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: 'tie', line: [] };
    }
    return { winner: null, line: [] };
  };

  const computerMove = () => {
    if (!isPlayerTurn && !gameOver) {
      setTimeout(() => {
        let move;
        
        if (level === 1) {
          move = getRandomMove();
        } else if (level === 2) {
          move = getEasyMove();
        } else if (level === 3) {
          move = getMediumMove();
        } else {
          move = getHardMove();
        }
        
        if (move !== undefined) {
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);
          
          const result = checkWinner(newBoard);
          if (result.winner) {
            handleGameEnd(result.winner, result.line);
          } else {
            setIsPlayerTurn(true);
          }
        }
        playSound('move');
      }, 500);
    }
  };

  const getRandomMove = () => {
    const emptyCells = board.reduce((acc, cell, idx) => {
      if (!cell) acc.push(idx);
      return acc;
    }, []);
    if (emptyCells.length > 0) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    return undefined;
  };

  const getEasyMove = () => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] === 'O' && board[b] === 'O' && !board[c]) return c;
      if (board[a] === 'O' && board[c] === 'O' && !board[b]) return b;
      if (board[b] === 'O' && board[c] === 'O' && !board[a]) return a;
    }
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] === 'X' && board[b] === 'X' && !board[c]) return c;
      if (board[a] === 'X' && board[c] === 'X' && !board[b]) return b;
      if (board[b] === 'X' && board[c] === 'X' && !board[a]) return a;
    }
    return getRandomMove();
  };

  const getMediumMove = () => {
    if (board[4] === null) return 4;
    return getEasyMove();
  };

  const getHardMove = () => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] === 'O' && board[b] === 'O' && !board[c]) return c;
      if (board[a] === 'O' && board[c] === 'O' && !board[b]) return b;
      if (board[b] === 'O' && board[c] === 'O' && !board[a]) return a;
    }
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] === 'X' && board[b] === 'X' && !board[c]) return c;
      if (board[a] === 'X' && board[c] === 'X' && !board[b]) return b;
      if (board[b] === 'X' && board[c] === 'X' && !board[a]) return a;
    }
    if (board[4] === null) return 4;
    const corners = [0, 2, 6, 8].filter(i => board[i] === null);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    return getRandomMove();
  };

  useEffect(() => {
    computerMove();
  }, [isPlayerTurn]);

  const handleCellClick = (index) => {
    if (!isPlayerTurn || gameOver || board[index]) return;
    
    playSound('move');
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result.winner) {
      handleGameEnd(result.winner, result.line);
    } else {
      setIsPlayerTurn(false);
    }
  };

  const handleGameEnd = (winner, line) => {
    setWinningLine(line);
    setGameOver(true);
    
    if (winner === 'X') {
      const pointsEarned = 10 + (combo * 2);
      const newScore = score + pointsEarned;
      setScore(newScore);
      setCombo(combo + 1);
      setWinner('You win!');
      showMessage(`+${pointsEarned} points! Amazing!`, 'win');
      playSound('win');
      
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('tictactoeHighScore', newScore);
      }
      
      const newLevel = Math.floor(newScore / 100) + 1;
      if (newLevel > level && newLevel <= 10) {
        setLevel(newLevel);
        playSound('levelUp');
        showMessage(`Level ${newLevel}!`, 'level');
      }
    } else if (winner === 'O') {
      setLives(lives - 1);
      setCombo(0);
      setWinner('Computer wins!');
      showMessage('Try again!', 'lose');
      playSound('lose');
      
      if (lives - 1 === 0) {
        setTimeout(() => {
          playSound('gameOver');
        }, 1000);
      }
    } else if (winner === 'tie') {
      setWinner("It's a tie!");
      showMessage("Good game!", 'tie');
      playSound('tie');
    }
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
    setWinningLine([]);
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    resetBoard();
  };

  const renderCell = (index) => {
    const value = board[index];
    const isWinning = winningLine.includes(index);
    
    return (
      <motion.button
        key={index}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleCellClick(index)}
        disabled={!isPlayerTurn || gameOver || value !== null}
        className={`w-full aspect-square rounded-2xl bg-cream/90 backdrop-blur shadow-lg flex items-center justify-center transition-all ${
          isWinning ? 'bg-gold/40 ring-4 ring-gold' : ''
        } ${!isPlayerTurn || gameOver ? 'opacity-80' : 'hover:scale-105'}`}
      >
        {value === 'X' && <span className="text-6xl md:text-7xl font-bold text-softPink drop-shadow-lg">X</span>}
        {value === 'O' && <span className="text-6xl md:text-7xl font-bold text-blue-500 drop-shadow-lg">O</span>}
      </motion.button>
    );
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
            <span className="font-bold text-xl text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>
              Tic Tac Toe
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-lightYellow rounded-full px-4 py-2">
            <Star size={20} className="text-gold fill-gold" />
            <span className="font-bold text-darkBrown">{score}</span>
          </div>
          <div className="flex items-center gap-2 bg-cream rounded-full px-4 py-2">
            <Heart size={20} className="text-softPink" />
            <span className="font-bold text-darkBrown">{lives}</span>
          </div>
          <div className="flex items-center gap-2 bg-lightYellow rounded-full px-4 py-2">
            <span className="font-bold text-gold text-sm">x{combo}</span>
          </div>
          <button onClick={resetGame} className="p-2 rounded-full hover:bg-cream transition-colors">
            <RefreshCw size={20} className="text-warmBrown" />
          </button>
          <button onClick={() => setSoundOn(!soundOn)} className="p-2 rounded-full hover:bg-cream transition-colors">
            {soundOn ? <Volume2 size={20} className="text-warmBrown" /> : <VolumeX size={20} className="text-warmBrown" />}
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="inline-block bg-cream/80 backdrop-blur rounded-full px-6 py-2">
            <p className="text-warmBrown font-bold">
              Level {level} • {isPlayerTurn && !gameOver ? 'Your turn!' : winner ? 'Game Over' : 'Computer thinking...'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8 max-w-md mx-auto">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => renderCell(index))}
        </div>

        {winner && !showPopup && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <button
              onClick={resetBoard}
              className="px-6 py-2 bg-softPink text-cream rounded-full font-bold"
            >
              Play Again
            </button>
          </motion.div>
        )}

        <div className="text-center mt-6">
          <div className="inline-block bg-cream/80 backdrop-blur rounded-full px-4 py-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-softPink">X</span>
                <span className="text-xs text-warmBrown">You</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-blue-500">O</span>
                <span className="text-xs text-warmBrown">Computer</span>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ scale: 0, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, y: -50, opacity: 0 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className={`rounded-2xl px-8 py-6 shadow-2xl border-4 border-cream ${
                popupType === 'win' ? 'bg-gold' :
                popupType === 'lose' ? 'bg-softPink' :
                popupType === 'level' ? 'bg-mint' : 'bg-peach'
              }`}>
                <p className="text-3xl md:text-4xl font-bold text-cream whitespace-nowrap text-center">
                  {popupMessage}
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
                <p className="text-gold font-bold mb-4">New High Score!</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={resetGame}
                  className="flex-1 px-4 py-3 bg-softPink text-cream rounded-xl font-bold"
                >
                  Play Again
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
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

export default YuyuTicTacToe;