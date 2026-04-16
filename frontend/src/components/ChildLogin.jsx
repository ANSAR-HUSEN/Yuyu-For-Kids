import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Baby, Smile, Star, Crown } from 'lucide-react';

const ChildLogin = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch children from localStorage
  useEffect(() => {
    const storedChildren = localStorage.getItem('children');
    if (storedChildren) {
      setChildren(JSON.parse(storedChildren));
    } else {
      setChildren([
        { id: 1, name: "Hany", age: 7, avatar: "Baby", xp: 1234, level: 5, streak: 7, storiesRead: 12, gamesPlayed: 24, quizzesTaken: 15, badgesEarned: 8 },
        { id: 2, name: "Emma", age: 5, avatar: "Smile", xp: 890, level: 3, streak: 4, storiesRead: 8, gamesPlayed: 15, quizzesTaken: 10, badgesEarned: 5 }
      ]);
    }
    setLoading(false);
  }, []);

  const getAvatarIcon = (avatarName) => {
    const icons = { Baby, Smile, Star };
    return icons[avatarName] || Baby;
  };

  const handleChildSelect = (child) => {
 
    localStorage.setItem('currentChild', JSON.stringify(child));
    navigate('/kids-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-blush/5 to-peach/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-softPink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-warmBrown mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-blush/5 to-peach/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-softPink flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Crown size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-darkBrown">Who's with Yuyu today?</h1>
          <p className="text-warmBrown mt-2">Select your profile to start learning!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child) => {
            const AvatarIcon = getAvatarIcon(child.avatar);
            return (
              <motion.button
                key={child.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChildSelect(child)}
                className="bg-white rounded-3xl p-6 shadow-xl border-2 border-softPink/30 hover:border-softPink transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-softPink/20 to-mint/20 flex items-center justify-center border-2 border-softPink">
                    <AvatarIcon size={40} className="text-softPink" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-darkBrown">{child.name}</h2>
                    <p className="text-warmBrown">Age: {child.age} years</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-mint">
                      <span>Click to enter</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/parent-dashboard')}
            className="text-softPink text-sm hover:underline"
          >
            ← Parent Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChildLogin;