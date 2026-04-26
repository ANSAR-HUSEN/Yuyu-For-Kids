import React, { useState, useRef, useEffect } from 'react';
import { Home, Moon, Sun, Maximize2, Minimize2, Heart, Award, Loader2 } from 'lucide-react';

const BookReader = ({ book, onClose, onUpdateProgress, currentProgress }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Update progress when book is opened
    if (currentProgress < 10) {
      onUpdateProgress(book, 10);
    }
    setLoading(false);
  }, []);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  const markComplete = () => {
    onUpdateProgress(book, 100);
    onClose();
  };
  
  if (loading) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#2C2C2C]' : 'bg-[#FFF9F5]'}`}>
        <Loader2 className="w-12 h-12 text-[#FFB347] animate-spin mb-4" />
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-[#5C4033]'}`}>Opening {book.title}...</p>
      </div>
    );
  }
  
  return (
    <div ref={containerRef} className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-[#2C2C2C]' : 'bg-[#FFF9F5]'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-gray-700 bg-[#2C2C2C]' : 'border-[#FFDAC1] bg-white'}`}>
        <button onClick={onClose} className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-[#FFF9F5] text-[#5C4033] hover:bg-[#FFDAC1]/30'} border ${isDarkMode ? 'border-gray-700' : 'border-[#FFDAC1]'}`}>
          <Home className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <Heart className="w-4 h-4 text-[#FF9EAA]" />
          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#8B5E3C]'}`}>
            {book.title}
          </span>
          <Heart className="w-4 h-4 text-[#FF9EAA]" />
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-[#FFF9F5] text-[#5C4033] hover:bg-[#FFDAC1]/30'} border ${isDarkMode ? 'border-gray-700' : 'border-[#FFDAC1]'}`}>
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button onClick={toggleFullscreen} className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-[#FFF9F5] text-[#5C4033] hover:bg-[#FFDAC1]/30'} border ${isDarkMode ? 'border-gray-700' : 'border-[#FFDAC1]'}`}>
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Internet Archive Embedded Reader - Each book has its own unique archiveId */}
      <div className="flex-1">
        <iframe
          src={`https://archive.org/embed/${book.archiveId}?ui=embed#reading`}
          width="100%"
          height="100%"
          className="border-0"
          title={book.title}
          allowFullScreen
        />
      </div>
      
      {/* Footer */}
      <div className={`flex items-center justify-between px-6 py-4 border-t ${isDarkMode ? 'border-gray-700 bg-[#2C2C2C]' : 'border-[#FFDAC1] bg-white'}`}>
        <div className="flex items-center gap-3">
          <Heart className="w-4 h-4 text-[#FF9EAA]" />
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#8B5E3C]'}`}>
            Reading {book.title}
          </span>
          <Heart className="w-4 h-4 text-[#FF9EAA]" />
        </div>
        
        <button 
          onClick={markComplete} 
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium bg-[#FFB347] text-white hover:bg-[#ffa52e]"
        >
          <Award className="w-4 h-4" />
          Mark as Complete
        </button>
      </div>
    </div>
  );
};

export default BookReader;