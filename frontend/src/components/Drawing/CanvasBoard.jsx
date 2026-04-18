import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CanvasBoard = ({ 
  canvasRef, ctxRef, drawMode, currentTool, selectedSticker,
  color, brushSize, rainbowMode, sparkleMode,
  getRainbowColor, saveToHistory
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [ripples, setRipples] = useState([]);

  const addSparkles = (x, y) => {
    const ctx = ctxRef.current;
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = ['#FFD93D', '#FF80B5', '#48CAE4', '#6BCB77'][Math.floor(Math.random() * 4)];
      ctx.beginPath();
      ctx.arc(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const startDrawing = (e) => {
    if (!drawMode) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    setRipples(prev => [...prev, { x, y, id: Date.now() }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== Date.now())), 500);
    
    if (currentTool === 'magic') {
      addSparkles(x, y);
      saveToHistory();
      return;
    }
    
    if (currentTool === 'stamp' && selectedSticker) {
      const ctx = ctxRef.current;
      ctx.font = `${brushSize * 5}px Arial`;
      ctx.fillStyle = color;
      ctx.fillText(selectedSticker, x - 15, y + 15);
      saveToHistory();
      return;
    }
    
    setIsDrawing(true);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    
    if (rainbowMode) {
      ctxRef.current.strokeStyle = getRainbowColor();
    } else {
      ctxRef.current.strokeStyle = color;
    }
    ctxRef.current.lineWidth = brushSize;
    
    if (sparkleMode) {
      addSparkles(x, y);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (!drawMode) return;
    if (currentTool !== 'brush') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctxRef.current.lineTo(x, y);
    
    if (rainbowMode) {
      ctxRef.current.strokeStyle = getRainbowColor();
    } else {
      ctxRef.current.strokeStyle = color;
    }
    ctxRef.current.lineWidth = brushSize;
    
    ctxRef.current.stroke();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    
    if (sparkleMode && Math.random() > 0.8) {
      addSparkles(x, y);
    }
  };

  const endDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
      ctxRef.current.beginPath();
    }
  };

  return (
    <div className="relative flex-1 bg-white rounded-2xl shadow-xl border-2 border-gold/30 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ left: ripple.x, top: ripple.y }}
          className="absolute w-8 h-8 rounded-full border-2 border-gold pointer-events-none -translate-x-1/2 -translate-y-1/2"
        />
      ))}
    </div>
  );
};

export default CanvasBoard;