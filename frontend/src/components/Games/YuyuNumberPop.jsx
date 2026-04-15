// src/components/games/YuyuNumberPop.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Zap, ArrowLeft, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const YuyuNumberPop = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [question, setQuestion] = useState({});
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const [blastingBalloon, setBlastingBalloon] = useState(null);
  const [showYayMessage, setShowYayMessage] = useState(false);
  const [showTryAgainMessage, setShowTryAgainMessage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);

  const generateQuestion = () => {
    let attempts = 0;
    let newQuestion = null;
    let isDuplicate = true;
    
    while (isDuplicate && attempts < 20) {
      let num1, num2, answer, operator, questionText;
      
      const maxNum = level <= 3 ? 10 : level <= 6 ? 20 : 30;
      const operations = level <= 3 ? ['+'] : level <= 6 ? ['+', '-'] : ['+', '-', '×'];
      
      const operationIndex = (totalQuestionsAnswered + attempts) % operations.length;
      operator = operations[operationIndex];
      
      switch(operator) {
        case '+':
          num1 = Math.floor(Math.random() * maxNum) + 1;
          num2 = Math.floor(Math.random() * maxNum) + 1;
          answer = num1 + num2;
          break;
        case '-':
          num1 = Math.floor(Math.random() * maxNum) + Math.floor(maxNum/2);
          num2 = Math.floor(Math.random() * num1) + 1;
          answer = num1 - num2;
          break;
        case '×':
          num1 = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
          answer = num1 * num2;
          break;
        default:
          num1 = Math.floor(Math.random() * maxNum) + 1;
          num2 = Math.floor(Math.random() * maxNum) + 1;
          answer = num1 + num2;
          operator = '+';
      }
      
      questionText = `${num1} ${operator} ${num2}`;
      newQuestion = { text: questionText, answer: answer };
      isDuplicate = recentQuestions.includes(questionText);
      attempts++;
    }
    
    setRecentQuestions(prev => {
      const updated = [...prev, newQuestion.text];
      return updated.slice(-10);
    });
    setTotalQuestionsAnswered(prev => prev + 1);
    
    const correctAnswer = newQuestion.answer;
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      let wrong = correctAnswer + (Math.floor(Math.random() * 7) + 1);
      if (Math.random() > 0.5) wrong = correctAnswer - (Math.floor(Math.random() * 5) + 1);
      if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
        wrongAnswers.push(wrong);
      }
    }
    
    const allOptions = [correctAnswer, ...wrongAnswers];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    setOptions(allOptions);
    setQuestion(newQuestion);
  };

  const refreshOptions = () => {
    const correctAnswer = question.answer;
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      let wrong = correctAnswer + (Math.floor(Math.random() * 7) + 1);
      if (Math.random() > 0.5) wrong = correctAnswer - (Math.floor(Math.random() * 5) + 1);
      if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
        wrongAnswers.push(wrong);
      }
    }
    
    const allOptions = [correctAnswer, ...wrongAnswers];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    setOptions(allOptions);
  };

  useEffect(() => {
    generateQuestion();
    const savedHighScore = localStorage.getItem('numberPopHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  useEffect(() => {
    const newLevel = Math.floor(score / 100) + 1;
    if (newLevel !== level && newLevel <= 10) {
      setLevel(newLevel);
      playSound('levelUp');
      showMessage(`Level ${newLevel}!`);
    }
  }, [score]);

  const playSound = (type) => {
    if (!soundOn) return;
    console.log(`Playing sound: ${type}`);
  };

  const showMessage = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const handleAnswer = async (selected, index) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setSelectedAnswer(selected);
    const correct = selected === question.answer;
    setIsCorrect(correct);
    playSound(correct ? 'correct' : 'wrong');

    if (correct) {
      setBlastingBalloon(index);
      await new Promise(resolve => setTimeout(resolve, 200));
      setShowYayMessage(true);
      
      const pointsEarned = 10 + (combo * 2);
      const newScore = score + pointsEarned;
      setScore(newScore);
      setCombo(combo + 1);
      
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('numberPopHighScore', newScore);
      }
      
      setTimeout(() => {
        setShowYayMessage(false);
      }, 800);
      
      setTimeout(() => {
        generateQuestion();
        setSelectedAnswer(null);
        setIsCorrect(null);
        setBlastingBalloon(null);
        setIsProcessing(false);
      }, 600);
    } else {
      setShowTryAgainMessage(true);
      setLives(lives - 1);
      setCombo(0);
      
      setTimeout(() => {
        setShowTryAgainMessage(false);
      }, 1000);
      
      setTimeout(() => {
        if (lives - 1 === 0) {
          playSound('gameOver');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          refreshOptions();
          setSelectedAnswer(null);
          setIsCorrect(null);
          setIsProcessing(false);
        }
      }, 800);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setCombo(0);
    setRecentQuestions([]);
    setTotalQuestionsAnswered(0);
    generateQuestion();
    setSelectedAnswer(null);
    setIsCorrect(null);
    setBlastingBalloon(null);
    setShowYayMessage(false);
    setShowTryAgainMessage(false);
    setIsProcessing(false);
    showMessage('Game Reset! Ready to play?');
  };

  const getBalloonColor = (index) => {
    const colors = [
      'from-orange-400 to-orange-500',
      'from-yellow-400 to-yellow-500',
      'from-blue-400 to-blue-500',
      'from-pink-400 to-pink-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-softGrey overflow-hidden">
      <nav className="relative z-20 px-6 py-4 md:px-12 lg:px-24 flex justify-between items-center bg-cream/80 backdrop-blur-md shadow-sm rounded-full mx-6 mt-4 border border-peach">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-darkBrown hover:text-softPink transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium hidden md:inline">Exit Game</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-softPink flex items-center justify-center">
              <span className="text-cream font-bold text-lg">Y</span>
            </div>
            <span className="font-bold text-xl text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>Yuyu AI</span>
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
            <Zap size={20} className="text-gold" />
            <span className="font-bold text-darkBrown">x{combo}</span>
          </div>
          <button onClick={resetGame} className="p-2 rounded-full hover:bg-cream transition-colors">
            <RefreshCw size={20} className="text-warmBrown" />
          </button>
          <button onClick={() => setSoundOn(!soundOn)} className="p-2 rounded-full hover:bg-cream transition-colors">
            {soundOn ? <Volume2 size={20} className="text-warmBrown" /> : <VolumeX size={20} className="text-warmBrown" />}
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          key={question.text}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-cream/90 backdrop-blur rounded-3xl p-8 shadow-2xl">
            <p className="text-sm text-softPink font-bold mb-2">Level {level}</p>
            <h1 className="text-6xl md:text-7xl font-bold text-darkBrown">
              {question.text}
            </h1>
            <p className="text-warmBrown mt-2">Pop the correct balloon!</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {options.map((option, idx) => (
            <motion.button
              key={`${option}-${idx}-${question.text}-${options.join(',')}`}
              initial={{ y: 100, opacity: 0, rotate: 0 }}
              animate={{ y: 0, opacity: 1, rotate: [-5, 5, -5, 0] }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(option, idx)}
              disabled={selectedAnswer !== null || isProcessing}
              className="relative focus:outline-none"
            >
              <div className="relative">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-softGrey rounded-full" />
                
                <motion.div 
                  className={`relative bg-gradient-to-br ${getBalloonColor(idx)} rounded-full w-28 h-32 md:w-36 md:h-40 mx-auto shadow-lg flex items-center justify-center transition-all ${
                    selectedAnswer === option && isCorrect === true
                      ? 'scale-110 opacity-0'
                      : selectedAnswer === option && isCorrect === false
                      ? 'shake'
                      : ''
                  }`}
                  animate={blastingBalloon === idx ? {
                    scale: [1, 1.2, 1.5, 2, 0],
                    opacity: [1, 0.8, 0.5, 0.2, 0],
                    rotate: [0, 10, -10, 20, 0]
                  } : {}}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                    {option}
                  </span>
                  
                  {blastingBalloon === idx && (
                    <>
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-softPink rounded-full"
                          initial={{ x: 0, y: 0, opacity: 1 }}
                          animate={{
                            x: (Math.random() - 0.5) * 100,
                            y: (Math.random() - 0.5) * 100,
                            opacity: 0,
                            scale: 0
                          }}
                          transition={{ duration: 0.6 }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
                
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white/30 rounded-full" />
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showYayMessage && (
            <motion.div
              initial={{ scale: 0, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, y: -50, opacity: 0 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-gold rounded-2xl px-8 py-6 shadow-2xl border-4 border-cream">
                <p className="text-3xl md:text-4xl font-bold text-cream whitespace-nowrap">
                  Yayyy you are correct!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTryAgainMessage && (
            <motion.div
              initial={{ scale: 0, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, y: -50, opacity: 0 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-softPink rounded-2xl px-8 py-6 shadow-2xl border-4 border-cream">
                <p className="text-3xl md:text-4xl font-bold text-cream whitespace-nowrap">
                  Try Again!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPopup && !showYayMessage && !showTryAgainMessage && (
            <motion.div
              initial={{ scale: 0, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, y: -50, opacity: 0 }}
              className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-cream rounded-2xl px-6 py-4 shadow-2xl z-50 border-4 border-softPink"
            >
              <p className="text-xl font-bold text-darkBrown whitespace-nowrap">
                {popupMessage}
              </p>
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
              <p className="text-warmBrown mb-4">Your score: {score}</p>
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

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default YuyuNumberPop;