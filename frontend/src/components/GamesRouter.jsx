import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, Trophy, Flame, ArrowLeft,
  Shapes, Target
} from 'lucide-react';
import shape from '../assets/shape.png';
import pop from '../assets/pop.png';

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GameCard
          title="Shape Match"
          description="Tap the matching shape!"
          image={shape}
          color="from-peach to-softPink"
          icon={<Shapes size={20} />}
          onClick={() => handleGameClick('/YuyuShapeSorter')}
        />
        
        <GameCard
          title="Number Pop"
          description="Pop the right answer!"
          image={pop}
  color="from-blue-200 to-blue-400"
          icon={<Target size={20} />}
          onClick={() => handleGameClick('/YuyuNumberPop')}
        />
      </div>

      <div className="text-center py-6">
        <p className="text-warmBrown text-sm">More games coming soon!</p>
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
      <div className={`bg-gradient-to-br ${color} rounded-3xl p-6 shadow-xl overflow-hidden relative border-2 border-white/50`}>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-56 h-56 rounded-2xl bg-white/20 p-3 border-2 border-white/30 shadow-lg">
              <img src={image} alt={title} className="w-full h-full object-contain drop-shadow-lg" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-softPink">
              {icon}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-darkBrown mb-1">{title}</h3>
          <p className="text-warmBrown text-sm mb-4">{description}</p>
          
          <motion.button
            animate={{ scale: isHovered ? 1.05 : 1 }}
            className="bg-softPink text-white px-5 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-2"
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