import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, BookOpen, Puzzle, Palette, Zap, TrendingUp,
  Trophy, Flame, User, Menu, X, Settings, LogOut, 
  Plus, Edit2, Trash2, Award, BarChart3, CreditCard, 
  Lock, Users, Lightbulb, ChevronRight, Heart, 
  Shield, Gift, Sparkles, Baby, Smile, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('children');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [parentName, setParentName] = useState("Parent");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(parentName);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    pin: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const [children, setChildren] = useState([
    { id: 1, name: "Hany", age: 7, pin: "1234", xp: 1234, level: 5, streak: 7, avatar: "Baby", storiesRead: 12, gamesPlayed: 24, quizzesTaken: 15, badgesEarned: 8 },
    { id: 2, name: "Emma", age: 5, pin: "5678", xp: 890, level: 3, streak: 4, avatar: "Smile", storiesRead: 8, gamesPlayed: 15, quizzesTaken: 10, badgesEarned: 5 }
  ]);

  const parentInfo = {
    email: "parent@example.com",
    plan: "Family Premium",
    joined: "March 2024"
  };

  const tips = [
    { id: 1, title: "PIN Protection", icon: Lock, color: "#FF9EAA", tip: "Each child has a unique 4-digit PIN. This ensures they can only access their own learning profile." },
    { id: 2, title: "Learning Streaks", icon: Flame, color: "#FFB347", tip: "Daily learning builds habits! Encourage your child to log in every day to maintain their streak." },
    { id: 3, title: "Progress Tracking", icon: BarChart3, color: "#B5EAD7", tip: "Check the Progress tab weekly to see which subjects your child excels at or needs help with." },
    { id: 4, title: "Reward System", icon: Gift, color: "#FFDAC1", tip: "Celebrate achievements! When your child earns badges, celebrate their success to boost confidence." },
    { id: 5, title: "Screen Time Balance", icon: Shield, color: "#C4B5FD", tip: "Set daily limits. 30-45 minutes of learning per day is the sweet spot for young minds." },
    { id: 6, title: "Parent Involvement", icon: Heart, color: "#FF9EAA", tip: "Ask your child what they learned today! Talking about their achievements reinforces learning." }
  ];

  const navItems = [
    { id: 'children', icon: Users, label: 'Children' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'subscription', icon: CreditCard, label: 'Plan' }
  ];

  const childAvatars = [Baby, Smile, Sparkles, Star];
  const avatarNames = ['Baby', 'Smile', 'Sparkles', 'Star'];

  const saveChildrenToStorage = (updatedChildren) => {
    localStorage.setItem('children', JSON.stringify(updatedChildren));
  };

  const handleSaveName = () => {
    setParentName(tempName);
    setIsEditingName(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Child's name is required";
    if (!formData.age) errors.age = "Age is required";
    else if (parseInt(formData.age) < 3) errors.age = "Age must be at least 3";
    else if (parseInt(formData.age) > 18) errors.age = "Age must be less than 18";
    if (!formData.pin) errors.pin = "PIN is required";
    else if (!/^\d{4}$/.test(formData.pin)) errors.pin = "PIN must be exactly 4 digits";
    return errors;
  };

  const handleAddChild = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newChild = {
      id: Date.now(),
      name: formData.name,
      age: parseInt(formData.age),
      pin: formData.pin,
      avatar: avatarNames[children.length % avatarNames.length],
      xp: 0,
      level: 1,
      streak: 0,
      storiesRead: 0,
      gamesPlayed: 0,
      quizzesTaken: 0,
      badgesEarned: 0
    };

    const updatedChildren = [...children, newChild];
    setChildren(updatedChildren);
    saveChildrenToStorage(updatedChildren);
    setShowAddChildModal(false);
    resetForm();
  };

  const handleEditChild = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const updatedChildren = children.map(child => 
      child.id === editingChild.id 
        ? { ...child, name: formData.name, age: parseInt(formData.age), pin: formData.pin }
        : child
    );
    setChildren(updatedChildren);
    saveChildrenToStorage(updatedChildren);
    setEditingChild(null);
    setShowAddChildModal(false);
    resetForm();
  };

  const handleDeleteChild = (id) => {
    if (window.confirm('Are you sure you want to remove this child? All their progress will be lost.')) {
      const updatedChildren = children.filter(child => child.id !== id);
      setChildren(updatedChildren);
      saveChildrenToStorage(updatedChildren);
    }
  };

  const openAddModal = () => {
    resetForm();
    setEditingChild(null);
    setShowAddChildModal(true);
  };

  const openEditModal = (child) => {
    setEditingChild(child);
    setFormData({
      name: child.name,
      age: child.age.toString(),
      pin: child.pin
    });
    setFormErrors({});
    setShowAddChildModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', age: '', pin: '' });
    setFormErrors({});
  };

  const handleKidMode = () => {
    saveChildrenToStorage(children);
    navigate('/child-login');
  };

  const getAvatarIcon = (avatarName) => {
    const icons = { Baby, Smile, Sparkles, Star };
    return icons[avatarName] || Baby;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream pt-4">
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3C%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      <nav className="relative z-20 px-4 py-3 md:px-12 lg:px-24 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm rounded-full mx-4 md:mx-6 border border-peach">
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
          <span className="hidden md:inline-block text-xs bg-softPink/20 px-2 py-1 rounded-full text-warmBrown ml-2">Parent Portal</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-softPink/10 rounded-full px-3 py-1.5 border border-softPink/30">
            <User size={14} className="text-softPink" />
            <span className="font-bold text-darkBrown text-sm">{parentName}</span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleKidMode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-mint to-teal-300 text-darkBrown font-medium hover:opacity-90 transition-all shadow-md"
          >
            <Users size={18} />
            <span className="text-sm font-medium hidden md:inline">Kid Mode</span>
          </motion.button>
       <button 
  onClick={() => navigate('/')}
  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-softPink/20 transition-colors"
>
  <LogOut size={18} className="text-warmBrown" />
  <span className="text-sm font-medium text-warmBrown hidden md:inline">Logout</span>
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
                  <span className="font-bold text-xl text-darkBrown">Yuyu AI</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-softPink/20">
                  <X size={24} className="text-darkBrown" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                        isActive ? 'bg-softPink/20 shadow-md text-softPink' : 'text-warmBrown hover:bg-white/50'
                      }`}
                    >
                      <Icon size={22} />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
                <button
                  onClick={() => {
                    handleKidMode();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-warmBrown hover:bg-white/50 mt-4 border-t border-peach pt-4"
                >
                  <Users size={22} />
                  <span className="font-medium">Kid Mode</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex gap-0 px-0 py-6">
        <motion.aside 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block w-64 flex-shrink-0 ml-0"
        >
          <div className="sticky top-24 bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-4 ml-0">
            <div className="text-center mb-6 pb-4 border-b border-peach">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-softPink to-peach flex items-center justify-center mx-auto shadow-md border-3 border-white">
                <User size={40} className="text-darkBrown" />
              </div>
              <h3 className="font-bold text-darkBrown mt-2">{parentName}</h3>
              <p className="text-xs text-warmBrown">{parentInfo.email}</p>
            </div>
            
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all mb-2 ${
                    isActive ? 'bg-softPink/20 shadow-md text-softPink' : 'text-warmBrown hover:bg-white/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div layoutId="activeParentNav" className="ml-auto w-1.5 h-6 bg-softPink rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.aside>

        <div className="flex-1 px-4 md:px-12 lg:px-12">
          
          {activeTab === 'children' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-darkBrown">My Children</h1>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openAddModal}
                  className="px-4 py-2 bg-softPink text-white rounded-full flex items-center gap-2 text-sm font-bold shadow-md"
                >
                  <Plus size={16} /> Add Child
                </motion.button>
              </div>

              {children.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-softPink">
                  <Users size={48} className="text-softPink mx-auto mb-4 opacity-50" />
                  <p className="text-warmBrown mb-4">No children added yet</p>
                  <button onClick={openAddModal} className="px-4 py-2 bg-softPink text-white rounded-full inline-flex items-center gap-2">
                    <Plus size={16} /> Add Your First Child
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {children.map((child, idx) => {
                    const AvatarIcon = getAvatarIcon(child.avatar);
                    return (
                      <motion.div
                        key={child.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl p-6 shadow-lg border-2 border-softPink/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-softPink/20 to-mint/20 flex items-center justify-center border-2 border-softPink">
                              <AvatarIcon size={32} className="text-softPink" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-darkBrown">{child.name}</h3>
                              <p className="text-warmBrown text-sm">Age: {child.age} years</p>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1">
                                  <Trophy size={14} className="text-gold" />
                                  <span className="text-xs font-bold">Level {child.level}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Flame size={14} className="text-orange-500" />
                                  <span className="text-xs font-bold">{child.streak} day streak</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => openEditModal(child)} className="p-2 rounded-full hover:bg-softPink/20 transition-colors">
                              <Edit2 size={18} className="text-warmBrown" />
                            </button>
                            <button onClick={() => handleDeleteChild(child.id)} className="p-2 rounded-full hover:bg-softPink/20 transition-colors">
                              <Trash2 size={18} className="text-warmBrown" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-peach">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-warmBrown">PIN Code:</span>
                            <span className="font-mono font-bold text-darkBrown">{child.pin}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-warmBrown">Total XP:</span>
                            <span className="font-bold text-darkBrown">{child.xp} points</span>
                          </div>
                          <button className="w-full mt-3 px-4 py-2 bg-mint text-darkBrown rounded-full text-sm font-bold hover:opacity-80 transition">
                            View Progress →
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTipsModal(true)}
                className="mt-8 w-full bg-gradient-to-r from-softPink/20 to-gold/20 rounded-2xl p-4 border-2 border-softPink/50 hover:border-softPink transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-softPink/30 flex items-center justify-center">
                      <Lightbulb size={24} className="text-gold" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-darkBrown text-lg">Parent Tips & Tricks</h3>
                      <p className="text-sm text-warmBrown">Click to discover helpful tips for your child's learning journey</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-softPink" />
                </div>
              </motion.button>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl md:text-3xl font-bold text-darkBrown mb-6">Learning Progress</h1>
              
              {children.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-softPink">
                  <BarChart3 size={48} className="text-softPink mx-auto mb-4 opacity-50" />
                  <p className="text-warmBrown">Add a child first to see their progress</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {children.map((child) => {
                    const AvatarIcon = getAvatarIcon(child.avatar);
                    return (
                      <div key={child.id} className="bg-white rounded-3xl p-6 shadow-lg border border-peach">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-softPink/20 to-mint/20 flex items-center justify-center border-2 border-softPink">
                            <AvatarIcon size={28} className="text-softPink" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-darkBrown">{child.name}</h3>
                            <p className="text-xs text-warmBrown">Last active: Today</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-warmBrown">Weekly Goal</span>
                              <span className="font-bold text-darkBrown">65%</span>
                            </div>
                            <div className="h-2 bg-blush rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-softPink rounded-full" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 pt-3">
                            <div className="bg-cream rounded-xl p-2 text-center">
                              <BookOpen size={16} className="text-mint mx-auto mb-1" />
                              <p className="text-xs text-warmBrown">Stories</p>
                              <p className="font-bold text-darkBrown">{child.storiesRead} read</p>
                            </div>
                            <div className="bg-cream rounded-xl p-2 text-center">
                              <Puzzle size={16} className="text-softPink mx-auto mb-1" />
                              <p className="text-xs text-warmBrown">Games</p>
                              <p className="font-bold text-darkBrown">{child.gamesPlayed} played</p>
                            </div>
                            <div className="bg-cream rounded-xl p-2 text-center">
                              <Zap size={16} className="text-gold mx-auto mb-1" />
                              <p className="text-xs text-warmBrown">Quizzes</p>
                              <p className="font-bold text-darkBrown">{child.quizzesTaken} taken</p>
                            </div>
                            <div className="bg-cream rounded-xl p-2 text-center">
                              <Award size={16} className="text-gold mx-auto mb-1" />
                              <p className="text-xs text-warmBrown">Badges</p>
                              <p className="font-bold text-darkBrown">{child.badgesEarned} earned</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl md:text-3xl font-bold text-darkBrown mb-6">Account Settings</h1>
              
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-peach max-w-2xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-peach">
                    <div>
                      <p className="font-bold text-darkBrown">Parent Name</p>
                      {isEditingName ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="px-2 py-1 border border-softPink rounded-lg text-sm"
                            autoFocus
                          />
                          <button onClick={handleSaveName} className="text-softPink text-sm font-bold">Save</button>
                          <button onClick={() => setIsEditingName(false)} className="text-warmBrown text-sm">Cancel</button>
                        </div>
                      ) : (
                        <p className="text-sm text-warmBrown mt-1">{parentName}</p>
                      )}
                    </div>
                    {!isEditingName && (
                      <button onClick={() => setIsEditingName(true)} className="text-softPink text-sm font-bold">
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-peach">
                    <div>
                      <p className="font-bold text-darkBrown">Email Address</p>
                      <p className="text-sm text-warmBrown">{parentInfo.email}</p>
                    </div>
                    <button className="text-softPink text-sm font-bold">Change</button>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-peach">
                    <div>
                      <p className="font-bold text-darkBrown">Notifications</p>
                      <p className="text-sm text-warmBrown">Email updates about child's progress</p>
                    </div>
                    <button className="text-softPink text-sm font-bold">Manage</button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-darkBrown text-red-500">Delete Account</p>
                      <p className="text-sm text-warmBrown">Permanently delete all data</p>
                    </div>
                    <button className="text-red-500 text-sm font-bold">Delete</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'subscription' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl md:text-3xl font-bold text-darkBrown mb-6">Subscription Plan</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-softPink/10 to-mint/10 rounded-3xl p-6 border-2 border-softPink">
                  <h3 className="text-xl font-bold text-darkBrown mb-2">Family Premium</h3>
                  <p className="text-3xl font-bold text-darkBrown mb-4">$9.99<span className="text-sm text-warmBrown">/month</span></p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">✓ Up to 4 child profiles</li>
                    <li className="flex items-center gap-2 text-sm">✓ Unlimited games & stories</li>
                    <li className="flex items-center gap-2 text-sm">✓ Advanced progress tracking</li>
                    <li className="flex items-center gap-2 text-sm">✓ Parent insights & reports</li>
                  </ul>
                  <button className="w-full py-2 bg-softPink text-white rounded-full font-bold">Manage Subscription</button>
                </div>
                
                <div className="bg-white rounded-3xl p-6 border border-peach">
                  <h3 className="font-bold text-darkBrown mb-3">Billing Information</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span className="text-warmBrown">Plan:</span><span className="font-bold">Family Premium</span></p>
                    <p className="flex justify-between"><span className="text-warmBrown">Next billing:</span><span className="font-bold">April 15, 2026</span></p>
                    <p className="flex justify-between"><span className="text-warmBrown">Payment method:</span><span className="font-bold">•••• 4242</span></p>
                  </div>
                  <button className="w-full mt-4 py-2 border border-softPink text-softPink rounded-full font-bold text-sm">Update Payment</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add/Edit Child Modal */}
      <AnimatePresence>
        {showAddChildModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAddChildModal(false);
                resetForm();
                setEditingChild(null);
              }}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4"
            >
              <div className="bg-cream rounded-3xl shadow-2xl border-4 border-softPink overflow-hidden">
                <div className="bg-gradient-to-r from-softPink to-peach p-5 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">
                    {editingChild ? `Edit ${editingChild.name}` : 'Add New Child'}
                  </h2>
                  <button onClick={() => {
                    setShowAddChildModal(false);
                    resetForm();
                    setEditingChild(null);
                  }} className="p-1 rounded-full hover:bg-white/20">
                    <X size={20} className="text-white" />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-darkBrown mb-2">Child's Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Sophia, Liam"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-softPink transition-colors ${
                        formErrors.name ? 'border-red-400 bg-red-50' : 'border-peach bg-white'
                      }`}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-darkBrown mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g., 5"
                      min="3"
                      max="18"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-softPink transition-colors ${
                        formErrors.age ? 'border-red-400 bg-red-50' : 'border-peach bg-white'
                      }`}
                    />
                    {formErrors.age && <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-darkBrown mb-2">4-Digit PIN</label>
                    <input
                      type="password"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="****"
                      maxLength="4"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-softPink transition-colors font-mono text-center text-lg tracking-widest ${
                        formErrors.pin ? 'border-red-400 bg-red-50' : 'border-peach bg-white'
                      }`}
                    />
                    {formErrors.pin && <p className="text-red-500 text-xs mt-1">{formErrors.pin}</p>}
                    <p className="text-xs text-warmBrown mt-2">This PIN will be used by your child to access their profile</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowAddChildModal(false);
                        resetForm();
                        setEditingChild(null);
                      }}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-peach text-warmBrown font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingChild ? handleEditChild : handleAddChild}
                      className="flex-1 px-4 py-3 rounded-xl bg-softPink text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      {editingChild ? 'Save Changes' : 'Add Child'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tips Modal */}
      <AnimatePresence>
        {showTipsModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTipsModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl mx-4"
            >
              <div className="bg-cream rounded-3xl shadow-2xl border-4 border-softPink overflow-hidden max-h-[70vh] flex flex-col">
                <div className="bg-gradient-to-r from-softPink to-peach p-4 flex justify-between items-center flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={24} className="text-white" />
                    <h2 className="text-xl font-bold text-white">Parent Tips & Tricks</h2>
                  </div>
                  <button onClick={() => setShowTipsModal(false)} className="p-1 rounded-full hover:bg-white/20">
                    <X size={20} className="text-white" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                  {selectedTip ? (
                    <div>
                      <button onClick={() => setSelectedTip(null)} className="flex items-center gap-1 text-softPink mb-4 text-sm">
                        <ChevronRight size={16} className="rotate-180" /> Back to all tips
                      </button>
                      <div className="bg-white rounded-2xl p-6 border-2 border-softPink/30">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${selectedTip.color}20` }}>
                            <selectedTip.icon size={32} style={{ color: selectedTip.color }} />
                          </div>
                          <h3 className="text-2xl font-bold text-darkBrown">{selectedTip.title}</h3>
                        </div>
                        <p className="text-warmBrown leading-relaxed">{selectedTip.tip}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tips.map((tip) => {
                        const Icon = tip.icon;
                        return (
                          <motion.button
                            key={tip.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedTip(tip)}
                            className="bg-white rounded-2xl p-4 text-left border-2 border-peach hover:border-softPink transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${tip.color}20` }}>
                                <Icon size={24} style={{ color: tip.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-darkBrown">{tip.title}</h3>
                                <p className="text-xs text-warmBrown line-clamp-2">{tip.tip}</p>
                              </div>
                              <ChevronRight size={18} className="text-softPink flex-shrink-0" />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParentDashboard;