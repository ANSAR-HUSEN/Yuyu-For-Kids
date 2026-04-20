import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, Trophy, Flame, ArrowLeft,
  Shapes, Target, Heart, Binary, CloudRain
} from 'lucide-react';
import shape from '../assets/shape.png';
import pop from '../assets/pop.png';
import candy from '../assets/candy.png';
import tictac from '../assets/tictac.png';
import cloud from '../assets/cloud.png';

const GamesRouter = ({ childName, onBack }) => {
  const navigate = useNavigate();

  const handleGameClick = (gamePath) => {
    navigate(gamePath);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 px-4 md:px-12 lg:px-12"
    >
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-warmBrown hover:text-softPink transition-colors mb-3"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>
              Games
            </h1>
            <p className="text-warmBrown text-sm mt-1">Choose a game to play!</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1 bg-blush px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-peach">
              <Flame size={12} className="text-orange-500" />
              <span className="text-xs font-bold text-darkBrown">7 days</span>
            </div>
            <div className="flex items-center gap-1 bg-gold/20 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-gold/30">
              <Trophy size={12} className="text-gold" />
              <span className="text-xs font-bold text-darkBrown">Level 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* First Row - Original Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GameCard
          title="Shape Match"
          description="Tap the matching shape!"
          image={shape}
          color="from-emerald-700 to-green-800"
          icon={<Shapes size={20} />}
          onClick={() => handleGameClick('/YuyuShapeSorter')}
        />
        
        <GameCard
          title="Number Pop"
          description="Pop the right answer!"
          image={pop}
          color="from-red-900 to-burgundy-800"
          icon={<Target size={20} />}
          onClick={() => handleGameClick('/YuyuNumberPop')}
        />
      </div>

      {/* Second Row - New Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GameCard
          title="Tic Tac Toe"
          description="X vs O - Classic fun!"
          image={tictac}
          color="from-amber-600 to-yellow-700"
          icon={<Binary size={20} />}
          onClick={() => handleGameClick('/YuyuTicTacToe')}
        />
        
        <GameCard
          title="Candy Crush"
          description="Match 3 candies!"
          image={candy}
          color="from-gray-800 to-slate-900"
          icon={<Heart size={20} />}
          onClick={() => handleGameClick('/YuyuCandyCrush')}
        />
      </div>

      {/* Third Row - Cloud Adventure Game (NEW - Only this card has light grey + golden mix background) */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <GameCard
          title="Cloud Adventure"
          description="Catch raindrops, avoid bombs! Help Yuyu survive in the sky!"
          image={cloud}
          color="from-[#D4C9B3] to-[#C4B896]" // Light grey mixed with golden
          icon={<CloudRain size={20} />}
          onClick={() => handleGameClick('/YuyuCloudAdventure')}
        />
      </div>
    </motion.div>
  );
};

const GameCard = ({ title, description, image, color, icon, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`bg-gradient-to-br ${color} rounded-3xl p-6 shadow-xl overflow-hidden relative border-2 border-white/30`}>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-56 h-56 rounded-2xl bg-white/15 p-3 border-2 border-white/20 shadow-lg backdrop-blur-sm">
              <img src={image} alt={title} className="w-full h-full object-contain drop-shadow-lg" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-softPink">
              {icon}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{title}</h3>
          <p className="text-white/80 text-sm mb-4">{description}</p>
          
          <motion.button
            animate={{ scale: isHovered ? 1.05 : 1 }}
            className="bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-2 border border-white/30 hover:bg-white/30 transition"
          >
            Play
            <Gamepad2 size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GamesRouter;