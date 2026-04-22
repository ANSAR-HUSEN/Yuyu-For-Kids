// Books.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  Heart,
  X,
  BookOpen,
  Award,
  Flame,
  RotateCcw,
  ChevronRight,
  Clock,
  Sparkles,
  BookMarked,
  TrendingUp,
  Library,
  CheckCircle2,
  ArrowLeft,
  Home,
  Moon,
  Sun,
  Star
} from 'lucide-react';

// Storage keys
const STORAGE_KEYS = {
  PROGRESS: 'storyquest_progress',
  FAVORITES: 'storyquest_favorites',
  STREAK: 'storyquest_streak',
  XP: 'storyquest_xp',
  LAST_READ_DATE: 'storyquest_last_read'
};

const storage = {
  getProgress: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS)) || {};
    } catch {
      return {};
    }
  },
  setProgress: (progress) => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  },
  getFavorites: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
    } catch {
      return [];
    }
  },
  setFavorites: (favorites) => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  },
  getStreak: () => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.STREAK)) || 0;
    } catch {
      return 0;
    }
  },
  setStreak: (streak) => {
    localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
  },
  getXP: () => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEYS.XP)) || 0;
    } catch {
      return 0;
    }
  },
  setXP: (xp) => {
    localStorage.setItem(STORAGE_KEYS.XP, xp.toString());
  },
  getLastReadDate: () => {
    return localStorage.getItem(STORAGE_KEYS.LAST_READ_DATE);
  },
  setLastReadDate: (date) => {
    localStorage.setItem(STORAGE_KEYS.LAST_READ_DATE, date);
  }
};

const religiousKeywords = [
  'bible', 'biblical', 'god', 'jesus', 'christ', 'christian', 'church',
  'prayer', 'holy', 'gospel', 'testament', 'psalm', 'proverb', 'scripture',
  'quran', 'koran', 'islam', 'muslim', 'allah', 'mosque', 'prophet',
  'torah', 'jewish', 'judaism', 'synagogue', 'rabbi', 'hindu', 'buddha',
  'buddhist', 'temple', 'worship', 'faith', 'spiritual', 'divine', 'heaven',
  'angel', 'saint', 'miracle', 'blessing', 'catholic', 'protestant', 'mormon'
];

const filterReligiousContent = (books) => {
  return books.filter(book => {
    const title = (book.title || '').toLowerCase();
    const author = (book.authors?.[0]?.name || '').toLowerCase();
    const subjects = (book.subject || []).join(' ').toLowerCase();
    const combinedText = `${title} ${author} ${subjects}`;
    return !religiousKeywords.some(keyword => combinedText.includes(keyword));
  });
};

const updateReadingStreak = () => {
  const today = new Date().toDateString();
  const lastRead = storage.getLastReadDate();
  let streak = storage.getStreak();
  
  if (lastRead !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastRead === yesterday.toDateString()) {
      streak += 1;
    } else if (!lastRead) {
      streak = 1;
    } else {
      streak = 1;
    }
    
    storage.setStreak(streak);
    storage.setLastReadDate(today);
  }
  
  return streak;
};

const BookSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-3xl aspect-[3/4] mb-4"></div>
    <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
  </div>
);

const Confetti = ({ active }) => {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
            backgroundColor: ['#FF9EAA', '#FFDAC1', '#FFB347', '#FFD1DC', '#B5EAD7'][Math.floor(Math.random() * 5)],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1.5 + Math.random()}s`
          }}
        />
      ))}
    </div>
  );
};

const CelebrationPopup = ({ show, onClose, bookTitle }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-4xl p-10 max-w-md w-full text-center shadow-2xl animate-celebration-pop border border-[#FFDAC1]">
        <div className="w-20 h-20 mx-auto mb-6 bg-[#FFB347] rounded-3xl flex items-center justify-center">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-[#5C4033] mb-3">
          Amazing Progress
        </h3>
        <p className="text-[#8B5E3C] mb-6 text-lg">
          You finished "{bookTitle}"
        </p>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-[#FFB347] text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-lg">
            +50 XP
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-[#FF9EAA] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#ff8a9a] transition-all shadow-lg w-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const BookReader = ({ book, onClose, onUpdateProgress, currentProgress }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState('text-lg');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  
  const coverId = book.cover_id || book.cover_i;
  const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;
  const title = book.title || 'Untitled';
  const author = book.authors?.[0]?.name || 'Unknown Author';
  
  const pages = [
    { type: 'cover', content: null },
    { type: 'content', content: `Welcome to ${title} by ${author}. This is the beginning of a wonderful adventure. Turn the page to start reading this magical story filled with wonder and excitement.` },
    { type: 'content', content: `As you journey through these pages, you'll discover amazing characters and visit incredible places. Each chapter brings new surprises and valuable lessons about friendship, courage, and kindness.` },
    { type: 'content', content: `The story unfolds with beautiful illustrations and engaging prose that will capture your imagination. Let your mind wander through enchanted forests, soar above sparkling seas, and meet fascinating creatures along the way.` },
    { type: 'content', content: `Reading is a magical journey that never truly ends. Every book opens a door to a new world, and every page turned brings you closer to unforgettable adventures. Keep reading, keep dreaming, and keep exploring.` },
    { type: 'end', content: `You've reached the end of this preview. Well done on your reading journey! Every page you read helps you grow smarter and more imaginative. Come back tomorrow for a new adventure!` }
  ];
  
  const totalPages = pages.length;
  const progress = Math.round(((currentPage + 1) / totalPages) * 100);
  
  useEffect(() => {
    if (progress > currentProgress) {
      onUpdateProgress(book, progress);
    }
  }, [currentPage]);
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      onUpdateProgress(book, 100);
      onClose();
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
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
  
  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-[#2C2C2C]' : 'bg-[#FFF9F5]'}`}
    >
      <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-gray-700 bg-[#2C2C2C]' : 'border-[#FFDAC1] bg-white'}`}>
        <button
          onClick={onClose}
          className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-[#FFF9F5] text-[#5C4033] hover:bg-[#FFDAC1]/30'} border ${isDarkMode ? 'border-gray-700' : 'border-[#FFDAC1]'}`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <Home className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-[#8B5E3C]'}`}>
            Page {currentPage + 1} of {totalPages}
          </span>
          <div className={`h-2 w-24 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-[#FFDAC1]/30'}`}>
            <div 
              className="h-full bg-[#FFB347] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-sm ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-[#FFDAC1] text-[#5C4033]'}`}
          >
            <option value="text-base">Small</option>
            <option value="text-lg">Medium</option>
            <option value="text-xl">Large</option>
            <option value="text-2xl">Extra Large</option>
          </select>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-[#FFF9F5] text-[#5C4033] hover:bg-[#FFDAC1]/30'} border ${isDarkMode ? 'border-gray-700' : 'border-[#FFDAC1]'}`}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-[#FFF9F5] text-[#5C4033] hover:bg-[#FFDAC1]/30'} border ${isDarkMode ? 'border-gray-700' : 'border-[#FFDAC1]'}`}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="max-w-3xl w-full">
          {pages[currentPage].type === 'cover' ? (
            <div className="text-center">
              {coverUrl ? (
                <img src={coverUrl} alt={title} className="max-w-md mx-auto rounded-3xl shadow-2xl" />
              ) : (
                <div className="w-64 h-80 mx-auto bg-[#FFDAC1]/30 rounded-3xl flex items-center justify-center">
                  <Library className="w-16 h-16 text-[#FF9EAA]" />
                </div>
              )}
              <h1 className={`text-4xl font-bold mt-8 ${isDarkMode ? 'text-white' : 'text-[#5C4033]'}`}>{title}</h1>
              <p className={`text-xl mt-2 ${isDarkMode ? 'text-gray-400' : 'text-[#8B5E3C]'}`}>by {author}</p>
            </div>
          ) : pages[currentPage].type === 'end' ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-[#FFB347] rounded-3xl flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#5C4033]'}`}>Great Job</h2>
              <p className={`text-xl mb-8 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-[#8B5E3C]'}`}>
                {pages[currentPage].content}
              </p>
              <button
                onClick={markComplete}
                className="bg-[#FF9EAA] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#ff8a9a] transition-all shadow-lg"
              >
                Complete Book
              </button>
            </div>
          ) : (
            <div className={`${fontSize} leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-[#5C4033]'}`}>
              <p className="first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">
                {pages[currentPage].content}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className={`flex items-center justify-between px-6 py-4 border-t ${isDarkMode ? 'border-gray-700 bg-[#2C2C2C]' : 'border-[#FFDAC1] bg-white'}`}>
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-[#FFF9F5] text-[#5C4033] hover:bg-[#FFDAC1]/30'} border ${isDarkMode ? 'border-gray-700' : 'border-[#FFDAC1]'}`}
          style={{ minHeight: '48px' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        
        <button
          onClick={nextPage}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${isDarkMode ? 'bg-[#FFB347] text-[#5C4033] hover:bg-[#ffa52e]' : 'bg-[#FFB347] text-white hover:bg-[#ffa52e]'}`}
          style={{ minHeight: '48px' }}
        >
          {currentPage === totalPages - 1 ? 'Finish' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const BookCard = ({ book, index, onToggleFavorite, isFavorite, progress, onClick }) => {
  const coverId = book.cover_id || book.cover_i;
  const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;
  const title = book.title || 'Untitled';
  const author = book.authors?.[0]?.name || 'Unknown Author';
  const year = book.first_publish_year || '';
  const bookProgress = progress[book.key] || 0;
  
  return (
    <div
      className="group relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer animate-book-fade-in border border-[#FFDAC1]"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => onClick(book)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title} by ${author}`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(book)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(book.key);
        }}
        className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:scale-110 transition-all border border-[#FFDAC1]"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-[#FF9EAA] text-[#FF9EAA]' : 'text-[#8B5E3C]'}`} />
      </button>
      
      <div className="relative aspect-[3/4] bg-[#FFF9F5]">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FFDAC1]/20 ${coverUrl ? 'hidden' : 'flex'}`}>
          <Library className="w-12 h-12 text-[#FF9EAA] mb-3" />
          <span className="text-[#5C4033] font-medium text-sm line-clamp-3">{title}</span>
        </div>
        
        <div className="absolute inset-0 bg-[#5C4033]/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(book);
            }}
            className="bg-[#FFB347] text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 flex items-center gap-2"
            style={{ minHeight: '48px' }}
          >
            <BookOpen className="w-4 h-4" />
            Read Now
          </button>
        </div>
        
        {bookProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10">
            <div 
              className="h-full bg-[#FFB347] transition-all duration-700"
              style={{ width: `${bookProgress}%` }}
            />
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-[#5C4033] line-clamp-2 mb-2 text-lg leading-tight">{title}</h3>
        <p className="text-sm text-[#8B5E3C] line-clamp-1 mb-1">{author}</p>
        {year && <p className="text-xs text-[#8B5E3C]/60">{year}</p>}
        
        {bookProgress > 0 && bookProgress < 100 && (
          <div className="mt-3 inline-flex items-center gap-2 bg-[#FFDAC1]/30 px-3 py-1.5 rounded-full">
            <TrendingUp className="w-3 h-3 text-[#FFB347]" />
            <span className="text-xs font-semibold text-[#5C4033]">{bookProgress}% Complete</span>
            <ChevronRight className="w-3 h-3 text-[#5C4033]" />
          </div>
        )}
      </div>
    </div>
  );
};

const BookDetailModal = ({ book, isOpen, onClose, progress, onStartReading, isFavorite, onToggleFavorite }) => {
  const [readingTime] = useState(() => Math.floor(Math.random() * 11) + 5);
  
  if (!isOpen || !book) return null;
  
  const coverId = book.cover_id || book.cover_i;
  const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;
  const title = book.title || 'Untitled';
  const author = book.authors?.[0]?.name || 'Unknown Author';
  const description = book.description?.value || book.description || 'A wonderful story waiting to be discovered.';
  const bookProgress = progress[book.key] || 0;
  
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-4xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-modal-pop shadow-2xl border border-[#FFDAC1]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-lg hover:scale-110 transition-all border border-[#FFDAC1]"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <X className="w-5 h-5 text-[#5C4033]" />
        </button>
        
        <div className="lg:flex">
          <div className="lg:w-2/5 bg-[#FFF9F5] p-8">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              {coverUrl ? (
                <img src={coverUrl} alt={title} className="w-full h-auto" />
              ) : (
                <div className="w-full aspect-[3/4] flex flex-col items-center justify-center p-8 text-center bg-[#FFDAC1]/20">
                  <Library className="w-16 h-16 text-[#FF9EAA] mb-4" />
                  <span className="text-[#5C4033] font-medium">{title}</span>
                </div>
              )}
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 text-center shadow-md border border-[#FFDAC1]">
                <Clock className="w-6 h-6 text-[#FFB347] mx-auto mb-2" />
                <div className="text-xs text-[#8B5E3C] uppercase tracking-wider">Reading Time</div>
                <div className="text-2xl font-bold text-[#5C4033]">{readingTime} min</div>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-md border border-[#FFDAC1]">
                <BookOpen className="w-6 h-6 text-[#FF9EAA] mx-auto mb-2" />
                <div className="text-xs text-[#8B5E3C] uppercase tracking-wider">Progress</div>
                <div className="text-2xl font-bold text-[#5C4033]">{bookProgress}%</div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-3/5 p-8 lg:p-10">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#5C4033] leading-tight">{title}</h2>
              <button
                onClick={() => onToggleFavorite(book.key)}
                className="ml-4 w-12 h-12 flex items-center justify-center bg-[#FFF9F5] rounded-2xl hover:bg-[#FFDAC1]/30 transition-colors flex-shrink-0 border border-[#FFDAC1]"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#FF9EAA] text-[#FF9EAA]' : 'text-[#8B5E3C]'}`} />
              </button>
            </div>
            
            <p className="text-[#8B5E3C] mb-6 text-lg">by {author}</p>
            
            <div className="bg-[#FFF9F5] rounded-3xl p-7 mb-8 border border-[#FFDAC1]">
              <h3 className="font-bold text-[#5C4033] mb-3 flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-[#FFB347]" />
                About this book
              </h3>
              <p className="text-[#5C4033]/80 leading-relaxed">{typeof description === 'string' ? description : 'A magical adventure awaits.'}</p>
            </div>
            
            {bookProgress > 0 && (
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#8B5E3C] font-medium">Your Progress</span>
                  <span className="font-bold text-[#5C4033]">{bookProgress}%</span>
                </div>
                <div className="h-3 bg-[#FFDAC1]/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFB347] transition-all duration-700" style={{ width: `${bookProgress}%` }} />
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onStartReading(book)}
                className="flex-1 bg-[#FFB347] text-white font-bold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg"
                style={{ minHeight: '56px' }}
              >
                <BookOpen className="w-5 h-5" />
                Start Reading
              </button>
              <button
                onClick={() => onToggleFavorite(book.key)}
                className="bg-[#FF9EAA] text-white font-bold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{ minHeight: '56px' }}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  
  const [progress, setProgress] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationBook, setCelebrationBook] = useState(null);
  
  const filterOptions = ['All', 'Fairy Tales', 'Adventure', 'Bedtime', 'Animals'];
  
  useEffect(() => {
    setProgress(storage.getProgress());
    setFavorites(storage.getFavorites());
    setStreak(storage.getStreak());
    setXP(storage.getXP());
  }, []);
  
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://openlibrary.org/subjects/children.json?limit=24');
      if (!response.ok) throw new Error('Failed to fetch books');
      
      const data = await response.json();
      const filteredBooks = filterReligiousContent(data.works || []);
      setBooks(filteredBooks);
    } catch (err) {
      setError('Unable to load the library. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  
  const filteredBooks = useMemo(() => {
    let filtered = books;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(book => {
        const title = (book.title || '').toLowerCase();
        const author = (book.authors?.[0]?.name || '').toLowerCase();
        return title.includes(term) || author.includes(term);
      });
    }
    
    if (activeFilter !== 'All') {
      const filterMap = {
        'Fairy Tales': ['fairy', 'tale', 'princess', 'magic', 'dragon', 'castle', 'king', 'queen'],
        'Adventure': ['adventure', 'journey', 'quest', 'explore', 'pirate', 'treasure'],
        'Bedtime': ['bedtime', 'sleep', 'dream', 'moon', 'star', 'night'],
        'Animals': ['animal', 'dog', 'cat', 'bear', 'rabbit', 'fox', 'lion', 'elephant', 'monkey']
      };
      
      const keywords = filterMap[activeFilter] || [];
      filtered = filtered.filter(book => {
        const text = `${book.title} ${book.authors?.[0]?.name || ''}`.toLowerCase();
        return keywords.some(keyword => text.includes(keyword));
      });
    }
    
    if (showFavoritesOnly) {
      filtered = filtered.filter(book => favorites.includes(book.key));
    }
    
    return filtered;
  }, [books, searchTerm, activeFilter, showFavoritesOnly, favorites]);
  
  const handleToggleFavorite = (bookKey) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(bookKey)
        ? prev.filter(key => key !== bookKey)
        : [...prev, bookKey];
      storage.setFavorites(newFavorites);
      return newFavorites;
    });
  };
  
  const handleUpdateProgress = (book, newProgress) => {
    const isCompletion = newProgress === 100;
    const wasNotComplete = (progress[book.key] || 0) < 100;
    
    setProgress(prev => {
      const updated = { ...prev, [book.key]: newProgress };
      storage.setProgress(updated);
      return updated;
    });
    
    const newStreak = updateReadingStreak();
    setStreak(newStreak);
    
    if (isCompletion && wasNotComplete) {
      setXP(prev => {
        const newXP = prev + 50;
        storage.setXP(newXP);
        return newXP;
      });
      
      setCelebrationBook(book);
      setShowCelebration(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };
  
  const handleOpenModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };
  
  const handleStartReading = (book) => {
    setIsModalOpen(false);
    setSelectedBook(book);
    setIsReading(true);
  };
  
  const handleCloseReader = () => {
    setIsReading(false);
    setSelectedBook(null);
  };
  
  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      <style>{`
        @keyframes bookFadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes celebrationPop {
          0% { opacity: 0; transform: scale(0.7) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-book-fade-in {
          animation: bookFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-modal-pop {
          animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-confetti {
          animation: confetti 2.5s linear forwards;
        }
        .animate-celebration-pop {
          animation: celebrationPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .rounded-4xl { border-radius: 2rem; }
      `}</style>
      
      <Confetti active={showConfetti} />
      <CelebrationPopup show={showCelebration} onClose={() => setShowCelebration(false)} bookTitle={celebrationBook?.title || 'this book'} />
      
      {isReading && selectedBook ? (
        <BookReader book={selectedBook} onClose={handleCloseReader} onUpdateProgress={handleUpdateProgress} currentProgress={progress[selectedBook.key] || 0} />
      ) : (
        <>
          <nav className="relative z-20 px-6 py-4 md:px-12 lg:px-24 flex justify-between items-center bg-white/80 backdrop-blur-xl shadow-sm rounded-full mx-4 mt-4 lg:mx-8 border border-[#FFDAC1]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FF9EAA] flex items-center justify-center shadow-md">
                <BookMarked className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-[#5C4033] tracking-tight">StoryQuest</span>
            </div>
            <div className="hidden md:flex gap-8">
              <a href="#library" className="text-[#8B5E3C] hover:text-[#5C4033] font-medium">Library</a>
              <a href="#progress" className="text-[#8B5E3C] hover:text-[#5C4033] font-medium">Progress</a>
              <a href="#achievements" className="text-[#8B5E3C] hover:text-[#5C4033] font-medium">Achievements</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-[#FFDAC1]/30 px-4 py-2 rounded-full">
                <Award className="w-4 h-4 text-[#FFB347]" />
                <span className="font-semibold text-[#5C4033]">{xp} XP</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-[#FFDAC1]/30 px-4 py-2 rounded-full">
                <Flame className="w-4 h-4 text-[#FF9EAA]" />
                <span className="font-semibold text-[#5C4033]">{streak}</span>
              </div>
            </div>
          </nav>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#5C4033] tracking-tight leading-tight">
                Discover Your Next Adventure
              </h1>
              <p className="text-[#8B5E3C] text-lg mt-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFB347]" />
                Explore thousands of magical stories
              </p>
            </div>
            
            <div className="mb-10 space-y-5">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#8B5E3C]/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 bg-white border-2 border-[#FFDAC1] rounded-3xl focus:outline-none focus:border-[#FF9EAA] text-[#5C4033] placeholder-[#8B5E3C]/50 text-lg shadow-sm"
                  style={{ minHeight: '60px' }}
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-6 py-3 rounded-full font-medium transition-all text-sm shadow-sm ${
                        activeFilter === filter
                          ? 'bg-[#FF9EAA] text-white shadow-md scale-105'
                          : 'bg-white text-[#5C4033] hover:bg-[#FFDAC1]/30 border border-[#FFDAC1]'
                      }`}
                      style={{ minHeight: '44px' }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`ml-auto px-6 py-3 rounded-full font-medium transition-all text-sm shadow-sm flex items-center gap-2 ${
                    showFavoritesOnly
                      ? 'bg-[#FF9EAA] text-white shadow-md'
                      : 'bg-white text-[#5C4033] hover:bg-[#FFDAC1]/30 border border-[#FFDAC1]'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : ''}`} />
                  Favorites
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-[#FFDAC1]/20 border-2 border-[#FF9EAA] rounded-3xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#FFDAC1]/50 rounded-2xl flex items-center justify-center">
                  <Library className="w-8 h-8 text-[#8B5E3C]" />
                </div>
                <p className="text-[#5C4033] text-xl mb-6">{error}</p>
                <button
                  onClick={fetchBooks}
                  className="bg-[#FFB347] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#ffa52e] transition-all inline-flex items-center gap-2"
                  style={{ minHeight: '48px' }}
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
              </div>
            )}
            
            {!error && (
              <>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {[...Array(6)].map((_, i) => <BookSkeleton key={i} />)}
                  </div>
                ) : filteredBooks.length === 0 ? (
                  <div className="bg-[#FFDAC1]/10 rounded-4xl p-16 text-center border border-[#FFDAC1]/30">
                    <div className="w-20 h-20 mx-auto mb-6 bg-[#FFDAC1]/30 rounded-3xl flex items-center justify-center">
                      <Search className="w-8 h-8 text-[#8B5E3C]" />
                    </div>
                    <h3 className="text-3xl font-bold text-[#5C4033] mb-3">No books found</h3>
                    <p className="text-[#8B5E3C] text-lg mb-6">Try adjusting your search or filters</p>
                    <button
                      onClick={() => { setSearchTerm(''); setActiveFilter('All'); setShowFavoritesOnly(false); }}
                      className="bg-[#FF9EAA] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#ff8a9a] transition-all shadow-md"
                      style={{ minHeight: '48px' }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-[#8B5E3C] mb-6 text-lg">Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {filteredBooks.map((book, index) => (
                        <BookCard
                          key={book.key}
                          book={book}
                          index={index}
                          onToggleFavorite={handleToggleFavorite}
                          isFavorite={favorites.includes(book.key)}
                          progress={progress}
                          onClick={handleOpenModal}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
            
            <BookDetailModal
              book={selectedBook}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              progress={progress}
              onStartReading={handleStartReading}
              isFavorite={selectedBook ? favorites.includes(selectedBook.key) : false}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Books;