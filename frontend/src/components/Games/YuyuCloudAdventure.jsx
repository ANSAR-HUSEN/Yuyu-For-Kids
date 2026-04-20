import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Zap, ArrowLeft, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import yuyuImage from '../../assets/yuyu.png';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const YUYU_SIZE = 70;
const ITEM_SIZE = 28;

const YuyuCloudAdventure = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const yuyuImgRef = useRef(null);
  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [cloudSize, setCloudSize] = useState(100);
  const [hearts, setHearts] = useState(3);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  
  const gameRef = useRef({
    yuyuX: CANVAS_WIDTH / 2 - YUYU_SIZE / 2,
    raindrops: [],
    bombs: [],
    iceCreams: [],
    cloudSizePercent: 100,
    lastRaindropSpawn: 0,
    lastBombSpawn: 0,
    lastIceCreamSpawn: 0,
    lastShrinkTime: 0,
    frame: 0,
    particles: [],
    warningPlayed: false,
    currentCombo: 0
  });
  
  const animationRef = useRef(null);
  const lastTimestampRef = useRef(0);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('yuyuRunnerHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('yuyuRunnerHighScore', score);
    }
  }, [score, highScore]);

  // Load Yuyu image
  useEffect(() => {
    const img = new Image();
    img.src = yuyuImage;
    img.onload = () => {
      yuyuImgRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Yuyu image failed");
      setImageLoaded(true);
    };
  }, []);

  // Play sounds
  const playCollectSound = useCallback(() => {
    if (!soundOn) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1200;
      gain.gain.value = 0.1;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
    } catch(e) {}
  }, [soundOn]);

  const playBombSound = useCallback(() => {
    if (!soundOn) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 300;
      gain.gain.value = 0.15;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
    } catch(e) {}
  }, [soundOn]);

  const playIceCreamSound = useCallback(() => {
    if (!soundOn) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1000;
      gain.gain.value = 0.12;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
    } catch(e) {}
  }, [soundOn]);

  const playWarningSound = useCallback(() => {
    if (!soundOn) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 520;
      gain.gain.value = 0.12;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
    } catch(e) {}
  }, [soundOn]);

  const playGameOverSound = useCallback(() => {
    if (!soundOn) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 300;
      gain.gain.value = 0.15;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.6);
    } catch(e) {}
  }, [soundOn]);

  // Spawn items
  const spawnRaindrop = useCallback(() => {
    gameRef.current.raindrops.push({
      x: 20 + Math.random() * (CANVAS_WIDTH - 40),
      y: 30,
      type: 'raindrop'
    });
  }, []);

  const spawnBomb = useCallback(() => {
    gameRef.current.bombs.push({
      x: 20 + Math.random() * (CANVAS_WIDTH - 40),
      y: 30,
      type: 'bomb',
      wobble: Math.random() * Math.PI * 2
    });
  }, []);

  const spawnIceCream = useCallback(() => {
    gameRef.current.iceCreams.push({
      x: 20 + Math.random() * (CANVAS_WIDTH - 40),
      y: 30,
      type: 'icecream'
    });
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    gameRef.current = {
      yuyuX: CANVAS_WIDTH / 2 - YUYU_SIZE / 2,
      raindrops: [],
      bombs: [],
      iceCreams: [],
      cloudSizePercent: 100,
      lastRaindropSpawn: 0,
      lastBombSpawn: 0,
      lastIceCreamSpawn: 0,
      lastShrinkTime: 0,
      frame: 0,
      particles: [],
      warningPlayed: false,
      currentCombo: 0
    };
    setScore(0);
    setCloudSize(100);
    setHearts(3);
    setCombo(0);
    setGameState('playing');
  }, []);

  // Move Yuyu
  const moveYuyu = useCallback((direction) => {
    if (gameState !== 'playing') return;
    const g = gameRef.current;
    if (direction === 'left') {
      g.yuyuX = Math.max(10, g.yuyuX - 14);
    } else if (direction === 'right') {
      g.yuyuX = Math.min(CANVAS_WIDTH - YUYU_SIZE - 10, g.yuyuX + 14);
    }
  }, [gameState]);

  // Game logic
  const updateGame = useCallback((timestamp) => {
    if (gameState !== 'playing') return;
    
    const delta = Math.min(33, timestamp - lastTimestampRef.current);
    if (delta < 16) return;
    
    const g = gameRef.current;
    
    // Cloud shrinks
    if (timestamp - g.lastShrinkTime > 1000) {
      g.lastShrinkTime = timestamp;
      g.cloudSizePercent = Math.max(0, g.cloudSizePercent - 1);
      setCloudSize(g.cloudSizePercent);
      
      if (g.cloudSizePercent <= 20 && !g.warningPlayed) {
        g.warningPlayed = true;
        playWarningSound();
      }
      
      if (g.cloudSizePercent <= 0) {
        playGameOverSound();
        setGameState('gameover');
        return;
      }
    }
    
    // Spawn raindrops
    if (g.frame - g.lastRaindropSpawn > 25) {
      g.lastRaindropSpawn = g.frame;
      spawnRaindrop();
    }
    
    // Spawn bombs (every 45 frames)
    if (g.frame - g.lastBombSpawn > 45 && g.bombs.length < 4) {
      g.lastBombSpawn = g.frame;
      spawnBomb();
    }
    
    // Spawn ice cream (every 120 frames)
    if (g.frame - g.lastIceCreamSpawn > 120 && g.iceCreams.length < 2) {
      g.lastIceCreamSpawn = g.frame;
      spawnIceCream();
    }
    
    const yuyuCenterX = g.yuyuX + YUYU_SIZE / 2;
    const yuyuCenterY = CANVAS_HEIGHT - 110;
    
    // Update raindrops
    g.raindrops = g.raindrops.filter(drop => {
      drop.y += 4;
      const dropCenterX = drop.x + ITEM_SIZE / 2;
      const dropCenterY = drop.y + ITEM_SIZE / 2;
      
      if (Math.abs(dropCenterX - yuyuCenterX) < 45 && Math.abs(dropCenterY - yuyuCenterY) < 50) {
        playCollectSound();
        const newSize = Math.min(100, g.cloudSizePercent + 5);
        g.cloudSizePercent = newSize;
        setCloudSize(newSize);
        const newCombo = g.currentCombo + 1;
        g.currentCombo = newCombo;
        setCombo(newCombo);
        const pointsEarned = 1 + Math.floor(newCombo / 5);
        setScore(prev => prev + pointsEarned);
        if (newSize > 20) g.warningPlayed = false;
        return false;
      }
      return drop.y < CANVAS_HEIGHT - 60;
    });
    
    // Update bombs (HURT YUYU)
    g.bombs = g.bombs.filter(bomb => {
      bomb.y += 4.5;
      bomb.wobble += 0.15;
      const wobbleX = Math.sin(bomb.wobble) * 4;
      const bombCenterX = bomb.x + ITEM_SIZE / 2 + wobbleX;
      const bombCenterY = bomb.y + ITEM_SIZE / 2;
      
      if (Math.abs(bombCenterX - yuyuCenterX) < 48 && Math.abs(bombCenterY - yuyuCenterY) < 55) {
        playBombSound();
        const newHearts = hearts - 1;
        setHearts(newHearts);
        g.currentCombo = 0;
        setCombo(0);
        
        // Add shake effect
        g.particles.push({ x: bomb.x, y: bomb.y, life: 15, type: 'boom' });
        
        if (newHearts <= 0) {
          playGameOverSound();
          setGameState('gameover');
        }
        return false;
      }
      return bomb.y < CANVAS_HEIGHT - 60;
    });
    
    // Update ice cream (HEAL YUYU)
    g.iceCreams = g.iceCreams.filter(ice => {
      ice.y += 3.5;
      const iceCenterX = ice.x + ITEM_SIZE / 2;
      const iceCenterY = ice.y + ITEM_SIZE / 2;
      
      if (Math.abs(iceCenterX - yuyuCenterX) < 45 && Math.abs(iceCenterY - yuyuCenterY) < 50) {
        playIceCreamSound();
        if (hearts < 3) {
          setHearts(prev => Math.min(3, prev + 1));
        }
        setScore(prev => prev + 2);
        g.particles.push({ x: ice.x, y: ice.y, life: 20, type: 'heart' });
        return false;
      }
      return ice.y < CANVAS_HEIGHT - 60;
    });
    
    // Update particles
    g.particles = g.particles.filter(p => {
      p.life--;
      return p.life > 0;
    });
    
    g.frame++;
    lastTimestampRef.current = timestamp;
  }, [gameState, hearts, spawnRaindrop, spawnBomb, spawnIceCream, playCollectSound, playBombSound, playIceCreamSound, playWarningSound, playGameOverSound]);

  // DRAW EVERYTHING
  const drawGame = useCallback((ctx) => {
    const g = gameRef.current;
    const currentCloudSize = g.cloudSizePercent;
    
    // Sky gradient using cream/peach colors
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#FFF9F5');
    gradient.addColorStop(0.5, '#FFD1DC');
    gradient.addColorStop(1, '#FFDAC1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw raindrops (gold colored)
    g.raindrops.forEach(drop => {
      ctx.fillStyle = '#FFB347';
      ctx.beginPath();
      ctx.ellipse(drop.x + ITEM_SIZE/2, drop.y + ITEM_SIZE/2, ITEM_SIZE/2, ITEM_SIZE/2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD700';
      ctx.font = '16px Arial';
      ctx.fillText('💧', drop.x + 5, drop.y + 20);
    });
    
    // Draw bombs
    g.bombs.forEach(bomb => {
      const wobbleX = Math.sin(bomb.wobble) * 4;
      ctx.fillStyle = '#5C4033';
      ctx.beginPath();
      ctx.ellipse(bomb.x + ITEM_SIZE/2 + wobbleX, bomb.y + ITEM_SIZE/2, ITEM_SIZE/2, ITEM_SIZE/2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FF9EAA';
      ctx.font = '20px Arial';
      ctx.fillText('💣', bomb.x + 3 + wobbleX, bomb.y + 22);
      ctx.beginPath();
      ctx.moveTo(bomb.x + 20 + wobbleX, bomb.y + 5);
      ctx.lineTo(bomb.x + 28 + wobbleX, bomb.y - 5);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFB347';
      ctx.stroke();
    });
    
    // Draw ice creams
    g.iceCreams.forEach(ice => {
      ctx.fillStyle = '#FFD1DC';
      ctx.beginPath();
      ctx.ellipse(ice.x + ITEM_SIZE/2, ice.y + ITEM_SIZE/2, ITEM_SIZE/2, ITEM_SIZE/2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FF9EAA';
      ctx.font = '18px Arial';
      ctx.fillText('🍦', ice.x + 3, ice.y + 22);
    });
    
    // Cloud - White with soft gray shadow for realistic cloud look
    const cloudWidth = 180 * (currentCloudSize / 100);
    const cloudHeight = 80 * (currentCloudSize / 100);
    const cloudX = CANVAS_WIDTH/2 - cloudWidth/2;
    const cloudY = CANVAS_HEIGHT - 110;
    
    // Draw cloud shadow first (soft gray)
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.ellipse(cloudX + cloudWidth * 0.2 + 4, cloudY + cloudHeight * 0.5 + 4, cloudWidth * 0.3, cloudHeight * 0.6, 0, 0, Math.PI * 2);
    ctx.ellipse(cloudX + cloudWidth * 0.5 + 4, cloudY + cloudHeight * 0.4 + 4, cloudWidth * 0.4, cloudHeight * 0.7, 0, 0, Math.PI * 2);
    ctx.ellipse(cloudX + cloudWidth * 0.8 + 4, cloudY + cloudHeight * 0.5 + 4, cloudWidth * 0.3, cloudHeight * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw main white cloud
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(cloudX + cloudWidth * 0.2, cloudY + cloudHeight * 0.5, cloudWidth * 0.3, cloudHeight * 0.6, 0, 0, Math.PI * 2);
    ctx.ellipse(cloudX + cloudWidth * 0.5, cloudY + cloudHeight * 0.4, cloudWidth * 0.4, cloudHeight * 0.7, 0, 0, Math.PI * 2);
    ctx.ellipse(cloudX + cloudWidth * 0.8, cloudY + cloudHeight * 0.5, cloudWidth * 0.3, cloudHeight * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add soft blueish tint to bottom of cloud for realism
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#B0C4DE';
    ctx.beginPath();
    ctx.ellipse(cloudX + cloudWidth * 0.5, cloudY + cloudHeight * 0.7, cloudWidth * 0.5, cloudHeight * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Yuyu
    const yuyuDrawX = g.yuyuX;
    const yuyuDrawY = cloudY - 15;
    if (yuyuImgRef.current) {
      ctx.drawImage(yuyuImgRef.current, yuyuDrawX, yuyuDrawY, YUYU_SIZE, YUYU_SIZE);
    } else {
      ctx.fillStyle = '#FF9EAA';
      ctx.beginPath();
      ctx.ellipse(yuyuDrawX + 35, yuyuDrawY + 35, 30, 30, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Particles (boom effects)
    g.particles.forEach(p => {
      if (p.type === 'boom') {
        ctx.fillStyle = `rgba(255, 100, 100, ${p.life / 15})`;
        ctx.font = '24px Arial';
        ctx.fillText('💥', p.x, p.y);
      } else if (p.type === 'heart') {
        ctx.fillStyle = `rgba(255, 107, 155, ${p.life / 20})`;
        ctx.font = '20px Arial';
        ctx.fillText('❤️', p.x, p.y);
      }
    });
    
    // Cloud health bar
    ctx.fillStyle = '#8B5E3C';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('☁️ Cloud Health', 20, 50);
    ctx.fillStyle = '#FFD1DC';
    ctx.fillRect(20, 60, 200, 15);
    ctx.fillStyle = '#B0C4DE';
    ctx.fillRect(20, 60, 200 * (currentCloudSize / 100), 15);
    
  
    
    // Score
    ctx.fillStyle = '#5C4033';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('💧 ' + score, CANVAS_WIDTH - 100, 110);
    
    // Warning
    if (currentCloudSize <= 20) {
      ctx.fillStyle = '#FF9EAA';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('⚠️ CLOUD IS SMALL! CATCH RAINDROPS! ⚠️', CANVAS_WIDTH/2 - 190, 140);
    }
    
    if (hearts === 1) {
      ctx.fillStyle = '#FF6B9D';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('⚠️ CAREFUL! ONE HEART LEFT! ⚠️', CANVAS_WIDTH/2 - 150, 170);
    }
  }, [score, cloudSize, hearts, imageLoaded]);

  // Draw game over screen
  const drawGameOverScreen = useCallback((ctx) => {
    ctx.fillStyle = 'rgba(92, 64, 51, 0.85)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 46px "Comic Sans MS", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', CANVAS_WIDTH/2, 180);
    
    ctx.font = 'bold 42px Arial';
    ctx.fillStyle = '#FFB347';
    ctx.fillText('💧 ' + score, CANVAS_WIDTH/2, 280);
    
    ctx.font = '24px Arial';
    ctx.fillStyle = '#FFF9F5';
    ctx.fillText('raindrops caught', CANVAS_WIDTH/2, 340);
    
    if (score === highScore && score > 0) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 28px Arial';
      ctx.fillText('🎉 NEW HIGH SCORE! 🎉', CANVAS_WIDTH/2, 400);
    }
    
    ctx.font = '22px Arial';
    ctx.fillStyle = '#FFD1DC';
    ctx.fillText('Tap to play again', CANVAS_WIDTH/2, 500);
    
    ctx.textAlign = 'left';
  }, [score, highScore]);

  // Animation loop
  const animate = useCallback((timestamp) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    if (gameState === 'playing') {
      updateGame(timestamp);
      drawGame(ctx);
    } else if (gameState === 'gameover') {
      drawGame(ctx);
      drawGameOverScreen(ctx);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [gameState, updateGame, drawGame, drawGameOverScreen]);

  // Handle taps
  const handleScreenTap = useCallback((e) => {
    if (gameState === 'gameover') {
      resetGame();
      return;
    }
    
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX;
    if (e.touches) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    const canvasX = (clientX - rect.left) * (canvas.width / rect.width);
    
    if (canvasX < canvas.width / 2) {
      moveYuyu('left');
    } else {
      moveYuyu('right');
    }
  }, [gameState, resetGame, moveYuyu]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'gameover' && e.code === 'Space') {
        e.preventDefault();
        resetGame();
      } else if (gameState === 'playing') {
        if (e.code === 'ArrowLeft') {
          e.preventDefault();
          moveYuyu('left');
        } else if (e.code === 'ArrowRight') {
          e.preventDefault();
          moveYuyu('right');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, resetGame, moveYuyu]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    lastTimestampRef.current = performance.now();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
  }, []);

  return (
    <div className="min-h-screen bg-softGrey overflow-hidden">
      {/* Header - EXACT same style as Number Pop game */}
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
            <span className="font-bold text-xl text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>Yuyu Runner</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-lightYellow rounded-full px-4 py-2">
            <Star size={20} className="text-gold fill-gold" />
            <span className="font-bold text-darkBrown">{score}</span>
          </div>
          <div className="flex items-center gap-2 bg-cream rounded-full px-4 py-2">
            <Heart size={20} className="text-softPink" />
            <span className="font-bold text-darkBrown">{hearts}</span>
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

      {/* Game Canvas */}
      <div className="flex flex-col items-center justify-center px-4 py-6">
        <div style={{
          borderRadius: '32px',
          boxShadow: '0 25px 45px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }}>
          <canvas
            ref={canvasRef}
            onClick={handleScreenTap}
            onTouchStart={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              handleScreenTap({ clientX: touch.clientX });
            }}
            style={{
              width: '100%',
              maxWidth: CANVAS_WIDTH,
              height: 'auto',
              display: 'block',
              cursor: 'pointer'
            }}
          />
        </div>
        {gameState === 'playing' && (
          <div className="mt-4 text-warmBrown text-sm flex gap-6">
            <span>👈 Tap Left = Move Left</span>
            <span>👉 Tap Right = Move Right</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default YuyuCloudAdventure;