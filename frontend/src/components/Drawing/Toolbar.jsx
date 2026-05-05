import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Hand, Undo2, Redo2, Trash2, Save, Download, Image as ImageIcon } from 'lucide-react';

const Toolbar = ({ drawMode, setDrawMode, undo, redo, setShowClearConfirm, saveDrawing, downloadDrawing, setShowGallery }) => {
  return (
    <div className="flex gap-2 mt-3 justify-center flex-wrap">
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDrawMode(!drawMode)} className={`p-2 md:p-3 rounded-xl shadow-md border transition-all ${drawMode ? 'bg-softPink text-white border-softPink' : 'bg-cream text-warmBrown border-peach'}`}>
        {drawMode ? <PenTool size={18} /> : <Hand size={18} />}
      </motion.button>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={undo} className="p-2 md:p-3 bg-cream rounded-xl shadow-md border border-peach">
        <Undo2 size={18} className="text-warmBrown" />
      </motion.button>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={redo} className="p-2 md:p-3 bg-cream rounded-xl shadow-md border border-peach">
        <Redo2 size={18} className="text-warmBrown" />
      </motion.button>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowClearConfirm(true)} className="p-2 md:p-3 bg-cream rounded-xl shadow-md border border-peach">
        <Trash2 size={18} className="text-warmBrown" />
      </motion.button>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={saveDrawing} className="p-2 md:p-3 bg-cream rounded-xl shadow-md border border-peach">
        <Save size={18} className="text-warmBrown" />
      </motion.button>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={downloadDrawing} className="p-2 md:p-3 bg-cream rounded-xl shadow-md border border-peach">
        <Download size={18} className="text-warmBrown" />
      </motion.button>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowGallery(true)} className="p-2 md:p-3 bg-cream rounded-xl shadow-md border border-peach">
        <ImageIcon size={18} className="text-warmBrown" />
      </motion.button>
    </div>
  );
};

export default Toolbar;