import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rainbow, Zap, Heart, Stamp, Shapes, Wand2, Palette } from 'lucide-react';

const colors = [
  '#FF3B6F', '#FF8C42', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B5DE5', '#FF80B5', '#FF6B6B',
  '#48CAE4', '#A7C957', '#7209B7', '#FFB7B2'
];

const stickers = [
  { icon: '🐶', name: 'Dog' }, { icon: '🐱', name: 'Cat' },
  { icon: '🦄', name: 'Unicorn' }, { icon: '🐉', name: 'Dragon' },
  { icon: '⭐', name: 'Star' }, { icon: '❤️', name: 'Heart' },
  { icon: '🌈', name: 'Rainbow' }, { icon: '☁️', name: 'Cloud' },
  { icon: '🌸', name: 'Flower' }, { icon: '🦋', name: 'Butterfly' },
  { icon: '🐝', name: 'Bee' }, { icon: '🐧', name: 'Penguin' }
];

const shapesList = [
  { icon: '●', name: 'circle' }, { icon: '■', name: 'square' },
  { icon: '▲', name: 'triangle' }, { icon: '❤️', name: 'heart' },
  { icon: '⭐', name: 'star' }
];

const Sidebar = ({
  sidebarOpen, setSidebarOpen, color, setColor,
  rainbowMode, toggleRainbowMode, glowMode, toggleGlowMode, sparkleMode,
  toggleSparkleMode, brushSize, setBrushSize, showStickers, setShowStickers,
  handleStickerClick, showShapes, setShowShapes, handleShapeClick,
  currentTool, setCurrentTool, showBackgroundSelector, setShowBackgroundSelector, setBackground
}) => {
  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          className="w-72 overflow-y-auto p-3 border-l border-peach bg-white/95 backdrop-blur-sm shadow-xl z-20"
        >
          <div className="grid grid-cols-4 gap-2 mb-4">
            {colors.map((c) => (
              <motion.button
                key={c}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setColor(c); }}
                className={`h-10 md:h-12 rounded-xl shadow-md transition-all ${color === c ? 'ring-4 ring-gold scale-105' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleRainbowMode} className={`flex-1 p-2 rounded-xl text-xs md:text-sm font-medium transition-all ${rainbowMode ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white' : 'bg-cream text-warmBrown'} shadow-md border border-peach`}>
              <Rainbow size={14} className="inline mr-1" /> Rainbow
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleGlowMode} className={`flex-1 p-2 rounded-xl text-xs md:text-sm font-medium transition-all ${glowMode ? 'bg-gold text-white' : 'bg-cream text-warmBrown'} shadow-md border border-peach`}>
              <Zap size={14} className="inline mr-1" /> Glow
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleSparkleMode} className={`flex-1 p-2 rounded-xl text-xs md:text-sm font-medium transition-all ${sparkleMode ? 'bg-softPink text-white' : 'bg-cream text-warmBrown'} shadow-md border border-peach`}>
              <Heart size={14} className="inline mr-1" /> Sparkle
            </motion.button>
          </div>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setBrushSize(4)} className={`flex-1 p-2 rounded-xl text-xs md:text-sm ${brushSize === 4 ? 'bg-gold text-white' : 'bg-cream text-warmBrown'} shadow-md`}>Small</button>
            <button onClick={() => setBrushSize(8)} className={`flex-1 p-2 rounded-xl text-xs md:text-sm ${brushSize === 8 ? 'bg-gold text-white' : 'bg-cream text-warmBrown'} shadow-md`}>Medium</button>
            <button onClick={() => setBrushSize(16)} className={`flex-1 p-2 rounded-xl text-xs md:text-sm ${brushSize === 16 ? 'bg-gold text-white' : 'bg-cream text-warmBrown'} shadow-md`}>Large</button>
          </div>

          <button onClick={() => setShowStickers(!showStickers)} className="w-full p-2 bg-mint rounded-xl font-medium text-darkBrown shadow-md flex items-center justify-center gap-2 text-sm mb-2">
            <Stamp size={16} /> Stickers {showStickers ? '▲' : '▼'}
          </button>
          {showStickers && (
            <div className="grid grid-cols-4 gap-2 mb-4 p-2 bg-white/50 rounded-xl">
              {stickers.map(s => (
                <motion.button key={s.name} whileHover={{ scale: 1.1 }} onClick={() => handleStickerClick(s)} className="p-2 bg-cream rounded-lg text-2xl hover:shadow-md">
                  {s.icon}
                </motion.button>
              ))}
            </div>
          )}

          <button onClick={() => setShowShapes(!showShapes)} className="w-full p-2 bg-mint rounded-xl font-medium text-darkBrown shadow-md flex items-center justify-center gap-2 text-sm mb-2">
            <Shapes size={16} /> Shapes {showShapes ? '▲' : '▼'}
          </button>
          {showShapes && (
            <div className="grid grid-cols-5 gap-2 mb-4 p-2 bg-white/50 rounded-xl">
              {shapesList.map(s => (
                <motion.button key={s.name} whileHover={{ scale: 1.1 }} onClick={() => handleShapeClick(s)} className="p-2 bg-cream rounded-lg text-2xl hover:shadow-md">
                  {s.icon}
                </motion.button>
              ))}
            </div>
          )}

          <button onClick={() => { setCurrentTool('magic'); }} className={`w-full p-2 rounded-xl font-medium shadow-md flex items-center justify-center gap-2 text-sm mb-2 ${currentTool === 'magic' ? 'bg-softPink text-white' : 'bg-cream text-warmBrown'}`}>
            <Wand2 size={16} /> Magic Wand
          </button>

          <button onClick={() => { setCurrentTool('brush'); }} className={`w-full p-2 rounded-xl font-medium shadow-md flex items-center justify-center gap-2 text-sm mb-2 ${currentTool === 'brush' ? 'bg-softPink text-white' : 'bg-cream text-warmBrown'}`}>
            <Palette size={16} /> Brush
          </button>

          <button onClick={() => setShowBackgroundSelector(!showBackgroundSelector)} className="w-full p-2 bg-peach rounded-xl font-medium text-darkBrown shadow-md text-sm mb-2">
            🎨 Background
          </button>
          {showBackgroundSelector && (
            <div className="grid grid-cols-2 gap-2 p-2 bg-white/50 rounded-xl">
              <button onClick={() => setBackground('plain')} className="p-2 bg-cream rounded-lg text-sm">Plain</button>
              <button onClick={() => setBackground('dots')} className="p-2 bg-cream rounded-lg text-sm">Dots</button>
              <button onClick={() => setBackground('grid')} className="p-2 bg-cream rounded-lg text-sm">Grid</button>
              <button onClick={() => setBackground('stars')} className="p-2 bg-cream rounded-lg text-sm">Stars</button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;