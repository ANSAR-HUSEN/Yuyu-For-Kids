import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Baby, Smile, Sparkles, Star,  Lock, AlertCircle, X,Crown } from 'lucide-react';

const ChildLogin = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPinPad, setShowPinPad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shake, setShake] = useState(false);

  // Fetch children from localStorage
  useEffect(() => {
    const storedChildren = localStorage.getItem('children');
    if (storedChildren) {
      setChildren(JSON.parse(storedChildren));
    } else {
      setChildren([
        { id: 1, name: "Hany", age: 7, pin: "1234", avatar: "Baby", color: "#FF9EAA", xp: 1234, level: 5, streak: 7 },
        { id: 2, name: "Emma", age: 5, pin: "5678", avatar: "Smile", color: "#B5EAD7", xp: 890, level: 3, streak: 4 }
      ]);
    }
    setLoading(false);
  }, []);

  const getAvatarIcon = (avatarName) => {
    const icons = { Baby, Smile, Sparkles, Star };
    return icons[avatarName] || Baby;
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    setShowPinPad(true);
    setPin('');
    setError('');
    setShake(false);
  };

  const handlePinInput = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError('');
      
      if (newPin.length === 4) {
        if (newPin === selectedChild.pin) {
          localStorage.setItem('currentChild', JSON.stringify(selectedChild));
          navigate('/dashboard');
        } else {
          setError('Wrong PIN. Please try again.');
          setPin('');
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
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

  if (!showPinPad) {
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
            <h1 className="text-3xl md:text-4xl font-bold text-darkBrown">Who's Learning Today?</h1>
            <p className="text-warmBrown mt-2">Select your profile to continue</p>
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
              onClick={() => navigate('/dashboard')}
              className="text-softPink text-sm hover:underline"
            >
              ← Parent Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // PIN Pad View - Child Friendly Design (smaller size)
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-blush/5 to-peach/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full overflow-hidden"
      >
        {/* Header */}
        <div className="text-center">
          <button 
            onClick={() => {
              setShowPinPad(false);
              setSelectedChild(null);
              setPin('');
              setError('');
            }}
            className="text-warmBrown text-xs mb-3 flex items-center gap-1 hover:text-softPink"
          >
            ← Back
          </button>
          
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-softPink/20 to-mint/20 flex items-center justify-center border-2 border-softPink">
              {selectedChild && (() => {
                const AvatarIcon = getAvatarIcon(selectedChild.avatar);
                return <AvatarIcon size={28} className="text-softPink" />;
              })()}
            </div>
            <h2 className="text-xl font-bold text-darkBrown mt-2">{selectedChild?.name}</h2>
            <p className="text-warmBrown text-xs flex items-center gap-1">
              <Lock size={12} /> Enter your 4-digit PIN
            </p>
          </div>
        </div>

        {/* PIN Display */}
        <div className="pt-6 pb-4">
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.2 }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-all ${
                  pin[i] 
                    ? 'bg-softPink text-white shadow-md' 
                    : 'bg-cream border-2 border-peach'
                }`}
              >
                {pin[i] ? '★' : '?'}
              </motion.div>
            ))}
          </div>

          {/* Error Message */}
          <div className="h-10 mt-2 text-center">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1"
              >
                <AlertCircle size={12} className="text-red-500" />
                <span className="text-red-500 text-xs">{error}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* PIN Pad - Child Friendly buttons */}
        <div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <motion.button
                key={digit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePinInput(digit.toString())}
                className="h-16 rounded-xl bg-gradient-to-br from-white to-cream shadow-md text-2xl font-bold text-darkBrown hover:shadow-lg transition-all border border-peach hover:border-softPink"
              >
                {digit}
              </motion.button>
            ))}
            <div className="h-16" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePinInput('0')}
              className="h-16 rounded-xl bg-gradient-to-br from-white to-cream shadow-md text-2xl font-bold text-darkBrown hover:shadow-lg transition-all border border-peach hover:border-softPink"
            >
              0
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackspace}
              className="h-16 rounded-xl bg-gradient-to-br from-blush to-softPink/30 shadow-md flex items-center justify-center hover:shadow-lg transition-all"
            >
              <X size={20} className="text-darkBrown" />
            </motion.button>
          </div>

          {/* Clear button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClear}
            className="w-full mt-4 py-2 rounded-xl bg-cream border border-peach text-warmBrown text-sm font-medium hover:bg-softPink/10 transition-all"
          >
            Clear All
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChildLogin;