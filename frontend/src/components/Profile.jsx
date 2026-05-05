import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Trophy, Flame, User, Award, Calendar, 
  Gamepad2, Crown, ArrowLeft, Brain, Target, Puzzle, Rocket,
  BookOpen, Sparkles, Medal, Gem, Smile, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const ChildProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [childData, setChildData] = useState(null);
  const [gameProgress, setGameProgress] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchChildData();
  }, []);

  const fetchChildData = async () => {
    setLoading(true);
    try {
      const childId = localStorage.getItem('currentChildId');
      if (!childId) {
        const storedChild = localStorage.getItem('currentChild');
        if (storedChild) {
          const child = JSON.parse(storedChild);
          setChildData(child);
        }
      }

      if (childId) {
        try {
          const children = await api.getChildren();
          if (children && children.length > 0) {
            const currentChild = children.find(child => child.id === childId);
            if (currentChild) setChildData(currentChild);
          }
        } catch (err) {}

        try {
          const progressData = await api.getAllGamesProgress(childId);
          if (progressData && progressData.games) {
            const gamesArray = Object.entries(progressData.games).map(([id, game]) => ({
              id, name: getGameName(id), level: game.level || 1,
              exp: game.exp || 0, icon: getGameIcon(id), color: getGameColor(id)
            }));
            setGameProgress(gamesArray);
          }
        } catch (err) {}

        try {
          const statsData = await api.getChildStats(childId);
          if (statsData && statsData.badges) setRewards(statsData.badges);
        } catch (err) {}
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGameName = (id) => ({
    candy_crush: 'Candy Crush', shape_sorter: 'Shape Match', number_pop: 'Number Pop',
    tic_tac_toe: 'Tic Tac Toe', memory_match: 'Memory Match', cloud_adventure: 'Cloud Adventure'
  }[id] || id);

  const getGameIcon = (id) => ({
    candy_crush: Puzzle, shape_sorter: Target, number_pop: Brain,
    tic_tac_toe: Target, memory_match: Brain, cloud_adventure: Rocket
  }[id] || Gamepad2);

  const getGameColor = (id) => ({
    candy_crush: "#FF8FAB", shape_sorter: "#B5EAD7", number_pop: "#FFD6E0",
    tic_tac_toe: "#FFB347", memory_match: "#8B6B5B", cloud_adventure: "#FFB347"
  }[id] || "#FF8FAB");

  const totalXP = childData?.totalPoints || 0;
  const gamesPlayed = childData?.gamesPlayed || 0;
  const badgesEarned = childData?.badgesEarned || rewards.length || 0;
  const streak = childData?.streak || 0;
  const currentLevel = Math.floor(totalXP / 100) + 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-softPink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-warmBrown mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button 
          onClick={() => navigate('/kids-dashboard')}
          className="group flex items-center gap-2 mb-6 text-warmBrown hover:text-softPink transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-softPink/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-blush/30 rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blush to-softPink flex items-center justify-center shadow-lg">
                <Smile size={52} className="text-darkBrown" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gold rounded-full px-2.5 py-1 shadow-md">
                <span className="text-white text-xs font-bold">Lvl {currentLevel}</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-darkBrown">
                {childData?.name || "Young Explorer"}
              </h1>
              <p className="text-warmBrown mt-1">Age {childData?.age || "?"} • Member since {childData?.createdAt ? new Date(childData.createdAt).toLocaleDateString() : "Recently"}</p>
              
              <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
                  <Flame size={14} className="text-orange-500" />
                  <span className="text-sm font-semibold text-darkBrown">{streak} day streak</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
                  <Star size={14} className="text-gold" />
                  <span className="text-sm font-semibold text-darkBrown">{totalXP} Total XP</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
              <Heart size={16} className="text-softPink" />
              <span className="text-sm text-warmBrown">Yuyu loves your progress!</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'stats', label: 'Stats', icon: Star },
            { id: 'games', label: 'Games', icon: Gamepad2 },
            { id: 'badges', label: 'Badges', icon: Trophy }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-softPink text-white shadow-md' 
                  : 'bg-white text-warmBrown hover:bg-softPink/10 border border-peach'
              }`}
            >
              <span className="flex items-center gap-2">
                <tab.icon size={14} />
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total XP", value: totalXP.toLocaleString(), icon: Star, bg: "bg-gold/10" },
              { label: "Games Played", value: gamesPlayed.toString(), icon: Gamepad2, bg: "bg-softPink/10" },
              { label: "Badges Earned", value: badgesEarned.toString(), icon: Trophy, bg: "bg-gold/10" },
              { label: "Stories Read", value: childData?.storiesRead || 0, icon: BookOpen, bg: "bg-mint/10" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  className={`${stat.bg} rounded-2xl p-4 border border-white/50 shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-darkBrown">{stat.value}</p>
                      <p className="text-xs text-warmBrown mt-1">{stat.label}</p>
                    </div>
                    <Icon size={24} className="text-softPink opacity-60" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'games' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameProgress.length > 0 ? gameProgress.map((game, idx) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl p-4 border border-peach shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-softPink/10 flex items-center justify-center">
                        <Icon size={20} style={{ color: game.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-darkBrown">{game.name}</h3>
                        <p className="text-xs text-warmBrown">Level {game.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-darkBrown">{game.exp}</p>
                      <p className="text-xs text-warmBrown">XP</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-blush rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (game.exp / 100) * 100)}%`, backgroundColor: game.color }} />
                  </div>
                </motion.div>
              );
            }) : (
              <div className="col-span-2 text-center py-12 bg-white/50 rounded-2xl border border-peach">
                <Gamepad2 size={48} className="text-softPink/30 mx-auto mb-3" />
                <p className="text-warmBrown">No games played yet!</p>
                <p className="text-sm text-warmBrown/60">Play some games to see your progress</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rewards.length > 0 ? rewards.map((reward, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-4 text-center border border-gold/30 shadow-sm"
              >
                <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-gold/10 flex items-center justify-center">
                  <Medal size={24} className="text-gold" />
                </div>
                <p className="font-bold text-darkBrown text-sm">{reward.badgeName}</p>
                <p className="text-xs text-warmBrown mt-1">{new Date(reward.unlockedAt).toLocaleDateString()}</p>
              </motion.div>
            )) : (
              <div className="col-span-4 text-center py-12 bg-white/50 rounded-2xl border border-peach">
                <Medal size={48} className="text-softPink/30 mx-auto mb-3" />
                <p className="text-warmBrown">No badges yet!</p>
                <p className="text-sm text-warmBrown/60">Complete achievements to earn badges</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChildProfile;