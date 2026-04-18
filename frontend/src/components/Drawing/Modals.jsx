import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, X } from 'lucide-react';

const Modals = ({ showAchievement, showClearConfirm, setShowClearConfirm, clearCanvas, showGallery, setShowGallery, savedDrawings, loadDrawing }) => {
  return (
    <>
      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div initial={{ scale: 0, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, y: -50 }} className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-gradient-to-r from-gold to-softPink rounded-2xl px-8 py-4 shadow-2xl border-4 border-white text-center">
              <PartyPopper size={40} className="text-white mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{showAchievement.title}</p>
              <p className="text-white/90">{showAchievement.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-cream rounded-2xl p-6 max-w-sm mx-4 text-center">
              <div className="text-5xl mb-3">🧸</div>
              <h3 className="text-xl font-bold text-darkBrown mb-2">Clear your drawing?</h3>
              <p className="text-warmBrown mb-4">Your magic will disappear! Are you sure?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 p-2 bg-peach rounded-xl text-darkBrown font-medium">Cancel</button>
                <button onClick={clearCanvas} className="flex-1 p-2 bg-softPink rounded-xl text-white font-medium">Clear</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-cream rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-darkBrown">My Gallery</h2>
                <button onClick={() => setShowGallery(false)} className="p-2 rounded-full hover:bg-blush"><X size={24} className="text-warmBrown" /></button>
              </div>
              {savedDrawings.length === 0 ? (
                <div className="text-center py-8"><p className="text-warmBrown">No drawings yet! Create your first masterpiece!</p></div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {savedDrawings.map(drawing => (
                    <motion.div key={drawing.id} whileHover={{ scale: 1.02 }} onClick={() => loadDrawing(drawing)} className="cursor-pointer bg-white rounded-xl p-2 shadow-md border border-peach">
                      <img src={drawing.dataUrl} alt="Drawing" className="w-full h-32 object-cover rounded-lg" />
                      <p className="text-xs text-warmBrown mt-1 text-center">{drawing.date}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modals;