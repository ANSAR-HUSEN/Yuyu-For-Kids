import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, BookOpen, Puzzle, Palette, Zap, TrendingUp,
  Trophy, Heart, Home, Gamepad2, Flame, User, Menu, X, PartyPopper
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GamesRouter from './KidsGamesRouter';

const DashboardCard = ({ icon: Icon, title, value, color, delay, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorMap = {
    softPink: '#FF9EAA',
    mint: '#B5EAD7',
    gold: '#FFB347',
  };

  const actualColor = colorMap[color] || color;

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay || 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        className="relative overflow-hidden rounded-3xl p-6 shadow-md bg-cream"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, ${actualColor}15 0%, transparent 50%)`,
          border: '2px solid rgba(0,0,0,0.08)',
        }}
        animate={isHovered ? { scale: 0.98, y: -2 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 15, duration: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{ opacity: isHovered ? 0.3 : 0.05 }}
          transition={{ duration: 0.2 }}
          style={{ background: `radial-gradient(circle at 70% 80%, ${actualColor}40 0%, transparent 70%)` }}
        />

        <div className="absolute top-4 right-4 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-black/60" />
          <div className="w-2 h-2 rounded-full bg-black/60" />
          <motion.div
            animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
            className="w-2.5 h-2.5 rounded-full bg-pink-400"
          />
        </div>

        <div className="absolute top-6 left-3 text-sm opacity-30">
          <Heart size={10} className="fill-softPink text-softPink" />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-3xl font-bold text-darkBrown">{value}</p>
            <p className="text-warmBrown font-medium">{title}</p>
          </div>
          <motion.div
            animate={isHovered ? { scale: 1.05, rotate: 3 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <div 
              className="flex items-center justify-center w-16 h-16 rounded-full shadow-md bg-white"
              style={{ 
                border: `3px solid ${actualColor}`,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1), inset 0 1px 2px white',
              }}
            >
              <Icon size={32} style={{ color: actualColor }} />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-2 w-6 h-3 rounded-full bg-pink-200/40 blur-sm" />
        <div className="absolute bottom-12 right-2 w-6 h-3 rounded-full bg-pink-200/40 blur-sm" />
      </motion.div>
    </motion.div>
  );
};

const QuickActionCard = ({ icon: Icon, title, color, delay, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorMap = {
    softPink: '#FF9EAA',
    mint: '#B5EAD7',
    peach: '#FFDAC1',
  };

  const actualColor = colorMap[color] || color;

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay || 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        className="relative overflow-hidden rounded-3xl p-6 shadow-md bg-cream"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, ${actualColor}15 0%, transparent 50%)`,
          border: '2px solid rgba(0,0,0,0.08)',
        }}
        animate={isHovered ? { scale: 0.98, y: -2 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 15, duration: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{ opacity: isHovered ? 0.3 : 0.05 }}
          transition={{ duration: 0.2 }}
          style={{ background: `radial-gradient(circle at 70% 80%, ${actualColor}40 0%, transparent 70%)` }}
        />

        <div className="absolute top-4 right-4 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-black/60" />
          <div className="w-2 h-2 rounded-full bg-black/60" />
          <motion.div
            animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
            className="w-2.5 h-2.5 rounded-full bg-pink-400"
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={isHovered ? { scale: 1.05, rotate: 3 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative mb-4"
          >
            <div 
              className="flex items-center justify-center w-20 h-20 rounded-full shadow-md bg-white"
              style={{ 
                border: `3px solid ${actualColor}`,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1), inset 0 1px 2px white',
              }}
            >
              <Icon size={36} style={{ color: actualColor }} />
            </div>
          </motion.div>
          <h3 className="text-xl font-bold text-center mb-2 text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>
            {title}
          </h3>
          <p className="text-center text-sm font-medium px-2 text-warmBrown">Fun & Educational</p>
        </div>

        <div className="absolute bottom-12 left-2 w-6 h-3 rounded-full bg-pink-200/40 blur-sm" />
        <div className="absolute bottom-12 right-2 w-6 h-3 rounded-full bg-pink-200/40 blur-sm" />
      </motion.div>
    </motion.div>
  );
};

const KidsDashboard = () => {
  const navigate = useNavigate();
  const childName = "hany";
  const [activeNav, setActiveNav] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const statsCards = [
    { icon: Puzzle, title: "Games Played", value: "24", color: "softPink", delay: 0, onClick: () => setActiveNav('games') },
    { icon: BookOpen, title: "Stories Read", value: "12", color: "mint", delay: 0.1, onClick: () => setActiveNav('stories') },
    { icon: Trophy, title: "Badges Earned", value: "8", color: "gold", delay: 0.2, onClick: () => setActiveNav('progress') }
  ];

  const quickActions = [
    { icon: Gamepad2, title: "Learning Games", color: "softPink", delay: 0.3, onClick: () => setActiveNav('games') },
    { icon: BookOpen, title: "Story Time", color: "mint", delay: 0.35, onClick: () => setActiveNav('stories') },
    { icon: Zap, title: "Fun Quizzes", color: "peach", delay: 0.4, onClick: () => setActiveNav('quiz') },
    { icon: Palette, title: "Creativity Zone", color: "black", delay: 0.45, onClick: () => setActiveNav('draw') }
  ];

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'games', icon: Gamepad2, label: 'Games' },
    { id: 'stories', icon: BookOpen, label: 'Stories' },
    { id: 'quiz', icon: Zap, label: 'Quiz' },
    { id: 'draw', icon: Palette, label: 'Draw' },
    { id: 'progress', icon: TrendingUp, label: 'Progress' }
  ];

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const renderMainContent = () => {
    if (activeNav === 'games') {
      return (
        <GamesRouter 
          childName={childName}
          onBack={() => setActiveNav('home')}
        />
      );
    }

    if (activeNav === 'home') {
      return (
        <div className="flex-1 px-4 md:px-12 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>
                  Welcome back, {childName}! <PartyPopper size={32} className="text-softPink fill-softPink ml-2 inline-block" />
                </h1>
                <p className="text-warmBrown mt-1 text-sm md:text-base">Ready for today's magical learning adventure?</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center gap-1 bg-blush px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-peach">
                  <Flame size={14} className="text-orange-500" />
                  <span className="text-xs md:text-sm font-bold text-darkBrown">7 day streak</span>
                </div>
                <div className="flex items-center gap-1 bg-gold/20 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-gold/30">
                  <Trophy size={14} className="text-gold" />
                  <span className="text-xs md:text-sm font-bold text-darkBrown">Level 5</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {statsCards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-darkBrown mb-4" style={{ fontFamily: "'Comic Neue', cursive" }}>
              Quick Launch
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 px-4 md:px-12 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <h2 className="text-3xl font-bold text-darkBrown mb-4">Coming Soon!</h2>
          <p className="text-warmBrown">This section is under construction.</p>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream">
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      <nav className="relative z-20 px-4 py-3 md:px-12 lg:px-24 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm rounded-full mx-4 md:mx-6 mt-4 border border-peach">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-full hover:bg-softPink/20 transition-colors"
          >
            <Menu size={24} className="text-darkBrown" />
          </button>
          <div className="w-10 h-10 rounded-full bg-softPink flex items-center justify-center">
            <span className="text-white font-bold text-lg">Y</span>
          </div>
          <span className="font-bold text-xl text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>Yuyu AI</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-softPink/10 rounded-full px-3 py-1.5 border border-softPink/30">
            <Star size={14} className="text-gold fill-gold" />
            <span className="font-bold text-darkBrown text-sm">1,234 XP</span>
          </div>
          <button 
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-peach to-orange-300 flex items-center justify-center shadow-md border-2 border-white transition-transform hover:scale-105 cursor-pointer"
          >
            <User size={20} className="text-darkBrown" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-cream/95 backdrop-blur-xl z-40 shadow-2xl border-r border-peach lg:hidden"
            >
              <div className="p-4 border-b border-peach flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-softPink flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Y</span>
                  </div>
                  <span className="font-bold text-xl text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>Yuyu AI</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-softPink/20 transition-colors"
                >
                  <X size={24} className="text-darkBrown" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveNav(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
                        isActive ? 'bg-softPink/20 shadow-md text-softPink' : 'text-warmBrown hover:bg-white/50'
                      }`}
                    >
                      <Icon size={22} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveNav"
                          className="ml-auto w-1.5 h-6 bg-softPink rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex gap-0 px-0 py-8">
        <motion.aside 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="hidden lg:block w-24 flex-shrink-0 ml-0"
        >
          <div className="sticky top-24 bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-3 ml-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveNav(item.id)}
                  className={`relative w-full mb-4 p-3 rounded-2xl transition-all duration-300 group ${
                    isActive ? 'bg-softPink/20 shadow-md' : 'hover:bg-white/50'
                  }`}
                >
                  <Icon 
                    size={24} 
                    className={`mx-auto mb-2 transition-colors ${
                      isActive ? 'text-softPink' : 'text-warmBrown group-hover:text-softPink'
                    }`} 
                  />
                  <span className={`text-xs font-medium block text-center transition-colors ${
                    isActive ? 'text-softPink' : 'text-warmBrown'
                  }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-softPink rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.aside>

        {renderMainContent()}
      </div>
    </div>
  );
};

export default KidsDashboard;