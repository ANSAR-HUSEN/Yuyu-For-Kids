import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Menu, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CanvasBoard from '../components/Drawing/CanvasBoard';
import Toolbar from '../components/Drawing/Toolbar';
import Sidebar from '../components/Drawing/Sidebar';
import Modals from '../components/Drawing/Modals';

const YuyuDrawingPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [color, setColor] = useState('#FF3B6F');
  const [brushSize, setBrushSize] = useState(8);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [rainbowMode, setRainbowMode] = useState(false);
  const [glowMode, setGlowMode] = useState(false);
  const [sparkleMode, setSparkleMode] = useState(false);
  const [savedDrawings, setSavedDrawings] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [funFact, setFunFact] = useState("Yuyu knows you can create anything!");
  const [currentTool, setCurrentTool] = useState('brush');
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [backgroundType, setBackgroundType] = useState('plain');
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawMode, setDrawMode] = useState(true);
  const [showStickers, setShowStickers] = useState(false);
  const [showShapes, setShowShapes] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);

  const funFacts = [
    "Yuyu knows you can create anything!",
    "Yuyu believes in YOU! Keep creating!",
    "Yuyu loves your imagination! Draw big!",
    "Yuyu says: You're an amazing artist!",
    "Yuyu thinks every drawing is a masterpiece!",
    "Yuyu is cheering for you! Keep going!",
    "Yuyu loves seeing your creativity grow!",
    "Yuyu is your #1 fan! Draw with joy!"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
    
    const saved = localStorage.getItem('yuyu_drawings');
    if (saved) setSavedDrawings(JSON.parse(saved));
    
    drawBackground();
    saveToHistory();
    
    setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    const interval = setInterval(() => {
      setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.shadowBlur = glowMode ? 15 : 0;
      ctxRef.current.shadowColor = glowMode ? color : 'transparent';
    }
  }, [glowMode, color]);

  const drawBackground = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    ctx.fillStyle = '#FFF9F5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (backgroundType === 'dots') {
      ctx.fillStyle = '#FFD1DC';
      for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (backgroundType === 'grid') {
      ctx.strokeStyle = '#FFDAC1';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    } else if (backgroundType === 'stars') {
      ctx.fillStyle = '#FFB347';
      for (let i = 0; i < 50; i++) {
        ctx.font = '15px Arial';
        ctx.fillText('⭐', Math.random() * canvas.width, Math.random() * canvas.height);
      }
    }
  };

  const getRainbowColor = () => {
    const rainbowColors = ['#FF3B6F', '#FF8C42', '#FFD93D', '#6BCB77', '#4D96FF', '#9B5DE5'];
    return rainbowColors[Math.floor(Date.now() / 100) % rainbowColors.length];
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const restoreFromHistory = (index) => {
    const img = new Image();
    img.src = history[index];
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreFromHistory(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreFromHistory(newIndex);
    }
  };

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawBackground();
    saveToHistory();
    setShowClearConfirm(false);
    showAchievementMessage("Clean Slate!", "Ready for new magic!");
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    const newDrawing = {
      id: Date.now(),
      dataUrl: dataUrl,
      date: new Date().toLocaleDateString(),
      name: `My Magic Drawing ${savedDrawings.length + 1}`
    };
    const updated = [newDrawing, ...savedDrawings].slice(0, 20);
    setSavedDrawings(updated);
    localStorage.setItem('yuyu_drawings', JSON.stringify(updated));
    showAchievementMessage("Masterpiece Saved!", "Yuyu is so proud of you!");
    const link = document.createElement('a');
    link.download = `yuyu-drawing-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `yuyu-magic-drawing.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const loadDrawing = (drawing) => {
    const img = new Image();
    img.src = drawing.dataUrl;
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
      saveToHistory();
    };
    setShowGallery(false);
    showAchievementMessage("Drawing Loaded!", "Let's add more magic!");
  };

  const showAchievementMessage = (title, message) => {
    setShowAchievement({ title, message });
    setTimeout(() => setShowAchievement(null), 3000);
  };

  const handleStickerClick = (sticker) => {
    setSelectedSticker(sticker.icon);
    setCurrentTool('stamp');
    setRainbowMode(false);
    showAchievementMessage(`${sticker.name} Sticker!`, "Tap anywhere to place it!");
  };

  const handleShapeClick = (shape) => {
    setCurrentTool('shape');
    setSelectedSticker(null);
    setRainbowMode(false);
    showAchievementMessage(`${shape.name} Stamp!`, "Tap on canvas to add!");
  };

  const toggleRainbowMode = () => {
    setRainbowMode(!rainbowMode);
    showAchievementMessage(rainbowMode ? "Rainbow Mode Off" : "Rainbow Mode On!", "Colors change as you draw!");
  };

  const toggleGlowMode = () => {
    setGlowMode(!glowMode);
    showAchievementMessage(glowMode ? "Glow Off" : "Glow Mode On!", "Your art will shine!");
  };

  const toggleSparkleMode = () => {
    setSparkleMode(!sparkleMode);
    showAchievementMessage(sparkleMode ? "Sparkles Off" : "Sparkle Mode On!", "Magical sparkles follow your brush!");
  };

 

  const setBackground = (type) => {
    setBackgroundType(type);
    drawBackground();
    saveToHistory();
  };

  const handleBack = () => {
    navigate('/kids-dashboard');
  };

  return (
    <div className="h-screen overflow-hidden bg-cream relative">
      {/* Left Frame */}
      <div className="fixed left-0 top-0 bottom-0 w-12 md:w-20 pointer-events-none z-20">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-softPink to-gold opacity-60" />
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-softPink/30 to-gold/30" />
        <div className="absolute left-3 top-8 w-8 h-12 border-l-2 border-t-2 border-gold/50 rounded-tl-2xl" />
        <div className="absolute left-5 top-12 w-2 h-2 rounded-full bg-gold animate-pulse" />
        <div className="absolute left-3 top-20 w-4 h-4 rounded-full border border-softPink/60" />
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 space-y-4">
          <div className="w-2 h-2 rotate-45 bg-gold/40 border border-gold/60" />
          <div className="w-3 h-3 rotate-45 bg-softPink/30 border border-softPink/50 mt-3" />
          <div className="w-2 h-2 rotate-45 bg-gold/40 border border-gold/60 mt-3" />
        </div>
        <div className="absolute left-3 bottom-8 w-8 h-12 border-l-2 border-b-2 border-gold/50 rounded-bl-2xl" />
        <div className="absolute left-5 bottom-20 w-2 h-2 rounded-full bg-softPink animate-pulse" />
        <div className="absolute left-3 bottom-32 w-3 h-3 rounded-full border border-gold/50" />
      </div>
      
      {/* Right Frame */}
      <div className="fixed right-0 top-0 bottom-0 w-12 md:w-20 pointer-events-none z-20">
        <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-softPink to-gold opacity-60" />
        <div className="absolute right-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-softPink/30 to-gold/30" />
        <div className="absolute right-3 top-8 w-8 h-12 border-r-2 border-t-2 border-gold/50 rounded-tr-2xl" />
        <div className="absolute right-5 top-12 w-2 h-2 rounded-full bg-gold animate-pulse" />
        <div className="absolute right-3 top-20 w-4 h-4 rounded-full border border-softPink/60" />
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 space-y-4">
          <div className="w-2 h-2 rotate-45 bg-gold/40 border border-gold/60" />
          <div className="w-3 h-3 rotate-45 bg-softPink/30 border border-softPink/50 mt-3" />
          <div className="w-2 h-2 rotate-45 bg-gold/40 border border-gold/60 mt-3" />
        </div>
        <div className="absolute right-3 bottom-8 w-8 h-12 border-r-2 border-b-2 border-gold/50 rounded-br-2xl" />
        <div className="absolute right-5 bottom-20 w-2 h-2 rounded-full bg-softPink animate-pulse" />
        <div className="absolute right-3 bottom-32 w-3 h-3 rounded-full border border-gold/50" />
      </div>

      {/* Header with Centered Fun Fact */}
      <nav className="relative z-30 px-6 py-3 md:px-12 lg:px-24 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm rounded-full mx-6 mt-4 border border-peach">
        <div className="flex items-center gap-2 w-1/3">
          <button onClick={handleBack} className="flex items-center gap-2 text-warmBrown hover:text-softPink transition-colors">
            <ChevronRight size={18} className="rotate-180" />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-softPink flex items-center justify-center">
            <span className="text-white font-bold text-lg">Y</span>
          </div>
          <span className="font-bold text-xl text-darkBrown hidden md:block" style={{ fontFamily: "'Comic Neue', cursive" }}>Yuyu AI</span>
        </div>
        
        {/* Centered Fun Fact */}
        <div className="flex-1 flex justify-center">
          <div className="bg-lightYellow/80 rounded-full px-4 py-1.5 shadow-sm border border-peach">
            <p className="text-xs md:text-sm text-warmBrown flex items-center gap-2">
              <Heart size={12} className="text-softPink" />
              {funFact}
              <Heart size={12} className="text-softPink" />
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-1/3 justify-end">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex items-center gap-2 text-warmBrown hover:text-softPink transition-colors">
            <Menu size={20} />
            <span className="text-sm font-medium hidden sm:inline">Tools</span>
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex h-[calc(100vh-80px)]">
        
        <div className="flex-1 p-3 md:p-4 flex flex-col">
          {/* Canvas Board */}
          <CanvasBoard
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            drawMode={drawMode}
            currentTool={currentTool}
            selectedSticker={selectedSticker}
            color={color}
            brushSize={brushSize}
            rainbowMode={rainbowMode}
            sparkleMode={sparkleMode}
            getRainbowColor={getRainbowColor}
            saveToHistory={saveToHistory}
          />

          {/* Toolbar */}
          <Toolbar
            drawMode={drawMode}
            setDrawMode={setDrawMode}
            undo={undo}
            redo={redo}
            setShowClearConfirm={setShowClearConfirm}
            saveDrawing={saveDrawing}
            downloadDrawing={downloadDrawing}
            setShowGallery={setShowGallery}
          />
        </div>

        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          color={color}
          setColor={setColor}
          rainbowMode={rainbowMode}
          toggleRainbowMode={toggleRainbowMode}
          glowMode={glowMode}
          toggleGlowMode={toggleGlowMode}
          sparkleMode={sparkleMode}
          toggleSparkleMode={toggleSparkleMode}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          showStickers={showStickers}
          setShowStickers={setShowStickers}
          handleStickerClick={handleStickerClick}
          showShapes={showShapes}
          setShowShapes={setShowShapes}
          handleShapeClick={handleShapeClick}
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          showBackgroundSelector={showBackgroundSelector}
          setShowBackgroundSelector={setShowBackgroundSelector}
          setBackground={setBackground}
        />
      </div>

      {/* Modals */}
      <Modals
        showAchievement={showAchievement}
        showClearConfirm={showClearConfirm}
        setShowClearConfirm={setShowClearConfirm}
        clearCanvas={clearCanvas}
        showGallery={showGallery}
        setShowGallery={setShowGallery}
        savedDrawings={savedDrawings}
        loadDrawing={loadDrawing}
      />
    </div>
  );
};

export default YuyuDrawingPage;