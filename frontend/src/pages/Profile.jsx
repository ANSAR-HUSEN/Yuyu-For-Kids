import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, BookOpen, Puzzle, Zap, Trophy, Flame, User, 
  Award, Calendar, Clock, Crown, Medal, Shield, 
  Edit2, Check, X, Camera, Palette, Gamepad2, BookMarked, 
  TrendingUp, Gem, Compass, Trash2, Target, Brain, Rocket,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChildProfile = () => {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [childName, setChildName] = useState("Hany");
  const [tempName, setTempName] = useState(childName);
  const [avatarType, setAvatarType] = useState('icon');
  const [selectedAvatar, setSelectedAvatar] = useState("crown");
  const [avatarImage, setAvatarImage] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const fileInputRef = useRef(null);

  const childLevel = 5;
  const childXp = 1234;
  const nextLevelXp = 2000;
  const streak = 7;
  const joinDate = "January 2026";

  const avatars = [
    { id: "crown", icon: Crown, color: "#FF9EAA", gradient: "from-pink-400 to-rose-400" },
    { id: "gem", icon: Gem, color: "#B5EAD7", gradient: "from-emerald-400 to-teal-400" },
    { id: "compass", icon: Compass, color: "#FFD700", gradient: "from-yellow-400 to-amber-400" },
    { id: "rocket", icon: Rocket, color: "#9CA3AF", gradient: "from-gray-400 to-gray-500" }
  ];

  const currentAvatar = avatars.find(a => a.id === selectedAvatar) || avatars[0];
  const AvatarIcon = currentAvatar.icon;

  const journeyStats = [
    { label: "Total XP", value: "1,234", icon: Star, color: "#FFD700", bg: "#FEF3C7", suffix: "points" },
    { label: "Streak", value: "7", icon: Flame, color: "#F97316", bg: "#FFEDD5", suffix: "days" },
    { label: "Level", value: "5", icon: Crown, color: "#FF9EAA", bg: "#FCE7F3", suffix: "explorer" },
    { label: "Rank", value: "#342", icon: Trophy, color: "#B5EAD7", bg: "#D1FAE5", suffix: "globally" }
  ];

  const achievements = [
    { title: "Math Wizard", icon: Brain, date: "2 days ago", color: "#FFD700", bg: "#FEF3C7", type: "gold" },
    { title: "Story Master", icon: BookMarked, date: "5 days ago", color: "#C0C0C0", bg: "#F3F4F6", type: "silver" },
    { title: "Creative Star", icon: Palette, date: "1 week ago", color: "#CD7F32", bg: "#FDE68A", type: "bronze" }
  ];

  const recentActivities = [
    { title: "Math Kingdom", type: "Game", xp: "+50", time: "2h ago", icon: Puzzle, color: "#FF9EAA" },
    { title: "Dragon's Secret", type: "Story", xp: "+30", time: "Yesterday", icon: BookOpen, color: "#B5EAD7" },
    { title: "Space Quiz", type: "Quiz", xp: "+45", time: "Yesterday", icon: Zap, color: "#FFDAC1" }
  ];

  const handleSaveName = () => {
    setChildName(tempName);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setTempName(childName);
    setIsEditingName(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result);
        setAvatarType('image');
        setIsEditingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const sectionNav = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'activity', label: 'Activity', icon: Clock }
  ];

  const StatCard = ({ label, value, icon: Icon, color, suffix }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl p-4 shadow-md bg-cream"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, ${color}15 0%, transparent 50%)`,
            border: '2px solid rgba(0,0,0,0.08)',
          }}
          animate={isHovered ? { scale: 0.98, y: -2 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{ opacity: isHovered ? 0.3 : 0.05 }}
            style={{ background: `radial-gradient(circle at 70% 80%, ${color}40 0%, transparent 70%)` }}
          />
          
          <div className="absolute top-2 right-3 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-darkBrown">{value}</p>
              <p className="text-sm text-warmBrown">{label}</p>
              <p className="text-xs text-warmBrown/60">{suffix}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md" style={{ border: `2px solid ${color}` }}>
              <Icon size={22} style={{ color }} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const AchievementCard = ({ title, icon: Icon, date, color, type }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl p-4 shadow-md bg-cream"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, ${color}15 0%, transparent 50%)`,
            border: '2px solid rgba(0,0,0,0.08)',
          }}
          animate={isHovered ? { scale: 0.98, y: -2 } : { scale: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm bg-white" style={{ border: `2px solid ${color}` }}>
              <Icon size={28} style={{ color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-darkBrown">{title}</h3>
                <div className={`text-xs px-2 py-0.5 rounded-full ${type === 'gold' ? 'bg-yellow-100 text-yellow-700' : type === 'silver' ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'}`}>
                  {type}
                </div>
              </div>
              <p className="text-xs text-warmBrown mt-1">Earned {date}</p>
            </div>
            <Star size={18} className="text-gold" />
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const ActivityCard = ({ title, type, xp, time, icon: Icon, color }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl p-4 shadow-md bg-cream"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, ${color}15 0%, transparent 50%)`,
            border: '2px solid rgba(0,0,0,0.08)',
          }}
          animate={isHovered ? { scale: 0.98, y: -2 } : { scale: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm" style={{ border: `2px solid ${color}` }}>
              <Icon size={22} style={{ color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-darkBrown">{title}</h3>
                <span className="text-xs text-warmBrown bg-cream px-2 py-0.5 rounded-full">{type}</span>
              </div>
              <p className="text-xs text-warmBrown mt-1 flex items-center gap-2">
                <Clock size={10} /> {time}
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-mint">{xp}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const handleBackToDashboard = () => {
    navigate('/kids-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-blush/5 to-peach/10">
      
      <div className="bg-white/80 backdrop-blur-md border-b border-peach sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-softPink/10 hover:bg-softPink/20 transition-all duration-200 text-darkBrown font-medium"
              >
                <ArrowLeft size={20} />
                <span className="hidden md:inline">Back to Dashboard</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-softPink flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">Y</span>
                </div>
                <span className="font-bold text-2xl text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>Yuyu AI</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-softPink/10 rounded-full px-4 py-2">
                <Star size={16} className="text-gold" />
                <span className="font-bold text-darkBrown text-sm">{childXp} XP</span>
              </div>
              <button 
                onClick={() => setIsEditingAvatar(true)}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-softPink to-peach flex items-center justify-center shadow-md"
              >
                {avatarType === 'image' && avatarImage ? (
                  <img src={avatarImage} alt="avatar" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <AvatarIcon size={20} className="text-darkBrown" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-softPink/10 via-peach/5 to-mint/10 rounded-3xl" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-8 p-6 md:p-8">
            <div className="relative group">
              <button 
                onClick={() => setIsEditingAvatar(true)}
                className="w-32 h-32 rounded-2xl bg-gradient-to-br from-softPink via-peach to-mint flex items-center justify-center shadow-xl overflow-hidden cursor-pointer"
              >
                {avatarType === 'image' && avatarImage ? (
                  <img src={avatarImage} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <AvatarIcon size={64} className="text-darkBrown" />
                )}
              </button>
              <div className="absolute -bottom-2 -right-2 bg-gold rounded-lg px-2 py-1 shadow-md">
                <span className="text-white text-xs font-bold">Lvl {childLevel}</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              {isEditingName ? (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="text-4xl md:text-5xl font-bold text-darkBrown bg-white border-2 border-softPink rounded-xl px-4 py-2 w-64"
                    style={{ fontFamily: "'Comic Neue', cursive" }}
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="p-2 rounded-lg bg-mint hover:bg-mint/70 transition">
                    <Check size={24} className="text-darkBrown" />
                  </button>
                  <button onClick={handleCancelEdit} className="p-2 rounded-lg bg-blush hover:bg-blush/70 transition">
                    <X size={24} className="text-darkBrown" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <h1 className="text-4xl md:text-5xl font-bold text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>
                    {childName}
                  </h1>
                  <button onClick={() => setIsEditingName(true)} className="p-1 rounded-lg hover:bg-softPink/10 transition">
                    <Edit2 size={20} className="text-warmBrown" />
                  </button>
                </div>
              )}
              
              <div className="flex flex-wrap items-center gap-3 mt-3 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                  <Flame size={14} className="text-orange-500" />
                  <span className="text-sm font-bold text-darkBrown">{streak} day streak</span>
                </div>
                <div className="flex items-center gap-2 bg-mint/20 px-3 py-1.5 rounded-lg">
                  <Calendar size={14} className="text-mint" />
                  <span className="text-sm text-warmBrown">Joined {joinDate}</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 bg-white rounded-2xl p-4 shadow-lg border border-peach">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-warmBrown">Journey to Level {childLevel + 1}</span>
                <span className="font-bold text-darkBrown">{childXp} / {nextLevelXp}</span>
              </div>
              <div className="h-3 bg-blush rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(childXp / nextLevelXp) * 100}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-softPink to-gold rounded-full"
                />
              </div>
              <p className="text-xs text-center text-warmBrown mt-2">
                {nextLevelXp - childXp} more XP to next level!
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {sectionNav.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-softPink text-white shadow-md' 
                    : 'bg-white text-warmBrown hover:bg-softPink/10 border border-peach'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={16} />
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>

        {activeSection === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {journeyStats.map((stat, idx) => (
                <StatCard key={idx} {...stat} />
              ))}
            </div>

            <div className="bg-gradient-to-r from-gold/10 via-softPink/10 to-mint/10 rounded-2xl p-6 border border-gold/30">
              <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                <div className="w-20 h-20 rounded-2xl bg-gold flex items-center justify-center shadow-lg">
                  <Crown size={40} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gold font-bold">LATEST ACHIEVEMENT</p>
                  <h3 className="text-2xl font-bold text-darkBrown mt-1">Math Wizard Badge!</h3>
                  <p className="text-warmBrown mt-1">Earned for completing all multiplication challenges</p>
                </div>
                <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-full">
                  <Star size={16} className="text-gold" />
                  <span className="font-bold text-darkBrown">+100 XP</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'achievements' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {achievements.map((achievement, idx) => (
              <AchievementCard key={idx} {...achievement} />
            ))}
            <div className="bg-cream rounded-2xl p-6 text-center border-2 border-dashed border-softPink">
              <Trophy size={32} className="text-softPink mx-auto mb-2" />
              <p className="text-warmBrown">3 more achievements until next milestone!</p>
            </div>
          </motion.div>
        )}

        {activeSection === 'activity' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <ActivityCard key={idx} {...activity} />
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {isEditingAvatar && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditingAvatar(false)}
                className="fixed inset-0 bg-black/50 z-50"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
              >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-softPink to-peach p-5 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Choose Your Avatar</h2>
                    <button onClick={() => setIsEditingAvatar(false)} className="p-1 rounded-full hover:bg-white/20">
                      <X size={20} className="text-white" />
                    </button>
                  </div>
                  <div className="p-6">
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="w-full mb-4 p-3 rounded-xl bg-cream border-2 border-dashed border-softPink flex items-center justify-center gap-2 hover:bg-softPink/10 transition"
                    >
                      <Camera size={20} className="text-softPink" />
                      <span className="text-darkBrown font-medium">Upload your own photo</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {avatars.map((avatar) => {
                        const Icon = avatar.icon;
                        const isSelected = selectedAvatar === avatar.id && avatarType === 'icon';
                        return (
                          <motion.button
                            key={avatar.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedAvatar(avatar.id);
                              setAvatarType('icon');
                              setAvatarImage(null);
                              setIsEditingAvatar(false);
                            }}
                            className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${
                              isSelected ? 'ring-2 ring-softPink shadow-lg bg-softPink/10' : 'bg-cream border border-peach'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatar.gradient} flex items-center justify-center`}>
                              <Icon size={24} className="text-white" />
                            </div>
                            <span className="font-medium text-darkBrown capitalize">{avatar.id}</span>
                            {isSelected && <Check size={16} className="text-softPink ml-auto" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ChildProfile;