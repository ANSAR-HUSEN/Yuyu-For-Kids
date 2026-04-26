import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Heart, RotateCcw, BookMarked, Library, Award, Flame, Star, X, BookOpen } from 'lucide-react';
import BookReader from './BookReader';

// KIDS TALE BOOKS ONLY - Each with unique archive ID
const KIDS_TALE_BOOKS = [
  {
    id: 'wizard_of_oz',
    title: 'The Wonderful Wizard of Oz',
    author: 'L. Frank Baum',
    archiveId: 'wizardofoz00baum',
    coverId: 1001025,
    description: 'Join Dorothy and Toto as they travel through the magical land of Oz! 🌈'
  },
  {
    id: 'alice_wonderland',
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    archiveId: 'alicesadventures00carr',
    coverId: 823910,
    description: 'Follow Alice down the rabbit hole into a whimsical wonderland! 🐰'
  },
  {
    id: 'peter_pan',
    title: 'Peter Pan',
    author: 'J. M. Barrie',
    archiveId: 'peterpanken00barr',
    coverId: 1099488,
    description: 'The boy who never grows up takes Wendy to Neverland! 🧚'
  },
  {
    id: 'jungle_book',
    title: 'The Jungle Book',
    author: 'Rudyard Kipling',
    archiveId: 'junglebook00kipl',
    coverId: 1010717,
    description: 'Mowgli\'s adventures with Baloo the bear and Bagheera! 🐻'
  },
  {
    id: 'secret_garden',
    title: 'The Secret Garden',
    author: 'Frances Hodgson Burnett',
    archiveId: 'secretgarden00burn',
    coverId: 1110872,
    description: 'A hidden garden brings magic and friendship! 🌸'
  },
  {
    id: 'pinocchio',
    title: 'The Adventures of Pinocchio',
    author: 'Carlo Collodi',
    archiveId: 'adventuresofpino00call',
    coverId: 1099922,
    description: 'A wooden puppet dreams of becoming a real boy! 🪵'
  },
  {
    id: 'heidi',
    title: 'Heidi',
    author: 'Johanna Spyri',
    archiveId: 'heidi00spyr',
    coverId: 1100139,
    description: 'A young girl brings joy to the Swiss Alps! 🏔️'
  },
  {
    id: 'winnie_pooh',
    title: 'Winnie-the-Pooh',
    author: 'A. A. Milne',
    archiveId: 'winniethepooh00milnuoft',
    coverId: 1099967,
    description: 'Join Pooh Bear and friends in the Hundred Acre Wood! 🍯'
  },
  {
    id: 'cinderella',
    title: 'Cinderella',
    author: 'Charles Perrault',
    archiveId: 'cinderellathe00perr',
    coverId: 1001260,
    description: 'The classic fairy tale of a kind girl who finds her prince! 👠'
  },
  {
    id: 'sleeping_beauty',
    title: 'Sleeping Beauty',
    author: 'Charles Perrault',
    archiveId: 'sleepingbeauty00perr',
    coverId: 1001261,
    description: 'A princess awakens from a magical sleep with true love\'s kiss! 💋'
  },
  {
    id: 'little_red_riding_hood',
    title: 'Little Red Riding Hood',
    author: 'Charles Perrault',
    archiveId: 'littleredridingh00perr',
    coverId: 1001262,
    description: 'A little girl meets a wolf in the woods! 🐺'
  },
  {
    id: 'three_little_pigs',
    title: 'The Three Little Pigs',
    author: 'Joseph Jacobs',
    archiveId: 'threelittlepigs00jaco',
    coverId: 1001263,
    description: 'Three pigs build houses to protect from the big bad wolf! 🐷'
  }
];

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

const Confetti = ({ active }) => {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <div key={i} className="absolute w-3 h-3 animate-confetti" style={{
          left: `${Math.random() * 100}%`, top: '-10%',
          backgroundColor: ['#FF9EAA', '#FFDAC1', '#FFB347', '#FFD1DC', '#B5EAD7'][Math.floor(Math.random() * 5)],
          animationDelay: `${Math.random() * 0.5}s`, animationDuration: `${1.5 + Math.random()}s`
        }} />
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
        <h3 className="text-3xl font-bold text-[#5C4033] mb-3">Amazing Progress!</h3>
        <p className="text-[#8B5E3C] mb-6 text-lg">You finished reading "{bookTitle}"</p>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-[#FFB347] text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-lg">+50 XP</div>
        </div>
        <button onClick={onClose} className="bg-[#FF9EAA] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#ff8a9a] transition-all shadow-lg w-full flex items-center justify-center gap-2">
          <Heart className="w-5 h-5" />
          Continue Reading
        </button>
      </div>
    </div>
  );
};

const BookSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-3xl aspect-[3/4] mb-4"></div>
    <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
  </div>
);

const BookCard = ({ book, index, onToggleFavorite, isFavorite, progress, onClick }) => {
  const coverUrl = `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`;
  const bookProgress = progress[book.id] || 0;
  
  return (
    <div className="group relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer animate-book-fade-in border border-[#FFDAC1]" style={{ animationDelay: `${index * 0.05}s` }} onClick={() => onClick(book)}>
      <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(book.id); }} className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:scale-110 transition-all border border-[#FFDAC1]">
        <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-[#FF9EAA] text-[#FF9EAA]' : 'text-[#8B5E3C]'}`} />
      </button>
      
      <div className="relative aspect-[3/4] bg-[#FFF9F5]">
        <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
        <div className="absolute inset-0 bg-[#5C4033]/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-6">
          <button onClick={(e) => { e.stopPropagation(); onClick(book); }} className="bg-[#FFB347] text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Read Now
          </button>
        </div>
        {bookProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10">
            <div className="h-full bg-[#FFB347] transition-all duration-700" style={{ width: `${bookProgress}%` }} />
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-[#5C4033] line-clamp-2 mb-2 text-lg leading-tight">{book.title}</h3>
        <p className="text-sm text-[#8B5E3C] line-clamp-1 mb-1">{book.author}</p>
        <p className="text-xs text-[#8B5E3C]/60 line-clamp-2 mt-2">{book.description}</p>
        {bookProgress > 0 && bookProgress < 100 && (
          <div className="mt-3 inline-flex items-center gap-2 bg-[#FFDAC1]/30 px-3 py-1.5 rounded-full">
            <span className="text-xs font-semibold text-[#5C4033]">{bookProgress}% Complete</span>
          </div>
        )}
      </div>
    </div>
  );
};

const BookModal = ({ book, isOpen, onClose, progress, onStartReading, isFavorite, onToggleFavorite }) => {
  if (!isOpen || !book) return null;
  
  const coverUrl = `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`;
  const bookProgress = progress[book.id] || 0;
  
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-4xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-modal-pop shadow-2xl border border-[#FFDAC1]">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-lg hover:scale-110 transition-all border border-[#FFDAC1]">
          <X className="w-5 h-5 text-[#5C4033]" />
        </button>
        
        <div className="lg:flex">
          <div className="lg:w-2/5 bg-[#FFF9F5] p-8">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src={coverUrl} alt={book.title} className="w-full h-auto" />
            </div>
          </div>
          
          <div className="lg:w-3/5 p-8 lg:p-10">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#5C4033] leading-tight">{book.title}</h2>
              <button onClick={() => onToggleFavorite(book.id)} className="ml-4 w-12 h-12 flex items-center justify-center bg-[#FFF9F5] rounded-2xl hover:bg-[#FFDAC1]/30 transition-colors flex-shrink-0 border border-[#FFDAC1]">
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#FF9EAA] text-[#FF9EAA]' : 'text-[#8B5E3C]'}`} />
              </button>
            </div>
            
            <p className="text-[#8B5E3C] mb-6 text-lg">by {book.author}</p>
            
            <div className="bg-[#FFF9F5] rounded-3xl p-7 mb-8 border border-[#FFDAC1]">
              <h3 className="font-bold text-[#5C4033] mb-3 flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-[#FF9EAA]" />
                About this book
              </h3>
              <p className="text-[#5C4033]/80 leading-relaxed">{book.description}</p>
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
              <button onClick={() => onStartReading(book)} className="flex-1 bg-[#FFB347] text-white font-bold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg">
                <BookOpen className="w-5 h-5" />
                Start Reading
              </button>
              <button onClick={() => onToggleFavorite(book.id)} className="bg-[#FF9EAA] text-white font-bold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
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
  const [books] = useState(KIDS_TALE_BOOKS);
  const [searchTerm, setSearchTerm] = useState('');
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
  
  useEffect(() => {
    setProgress(storage.getProgress());
    setFavorites(storage.getFavorites());
    setStreak(storage.getStreak());
    setXP(storage.getXP());
  }, []);
  
  const filteredBooks = useMemo(() => {
    let filtered = books;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term)
      );
    }
    if (showFavoritesOnly) {
      filtered = filtered.filter(book => favorites.includes(book.id));
    }
    return filtered;
  }, [books, searchTerm, showFavoritesOnly, favorites]);
  
  const handleToggleFavorite = (bookId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId];
      storage.setFavorites(newFavorites);
      return newFavorites;
    });
  };
  
  const handleUpdateProgress = (book, newProgress) => {
    const isCompletion = newProgress === 100;
    const wasNotComplete = (progress[book.id] || 0) < 100;
    
    setProgress(prev => {
      const updated = { ...prev, [book.id]: newProgress };
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
  
  const handleOpenModal = (book) => { setSelectedBook(book); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedBook(null); };
  const handleStartReading = (book) => { setIsModalOpen(false); setSelectedBook(book); setIsReading(true); };
  const handleCloseReader = () => { setIsReading(false); setSelectedBook(null); };
  
  const motivationalMessages = [
    "Yuyu loves reading with you!",
    "Keep reading, little star!",
    "Every page is a new adventure!",
    "Yuyu believes in YOU!",
    "Reading makes you magical!"
  ];
  const [currentMotivation, setCurrentMotivation] = useState(motivationalMessages[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMotivation(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#FFF9F5]">
      <style>{`
        @keyframes bookFadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalPop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        @keyframes celebrationPop { 0% { opacity: 0; transform: scale(0.7) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-book-fade-in { animation: bookFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-modal-pop { animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-confetti { animation: confetti 2.5s linear forwards; }
        .animate-celebration-pop { animation: celebrationPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .rounded-4xl { border-radius: 2rem; }
      `}</style>
      
      <Confetti active={showConfetti} />
      <CelebrationPopup show={showCelebration} onClose={() => setShowCelebration(false)} bookTitle={celebrationBook?.title || 'this book'} />
      
      {isReading && selectedBook ? (
        <BookReader 
          key={selectedBook.id} 
          book={selectedBook} 
          onClose={handleCloseReader} 
          onUpdateProgress={handleUpdateProgress} 
          currentProgress={progress[selectedBook.id] || 0} 
        />
      ) : (
        <>
          <div className="relative z-20 px-6 py-4 md:px-12 lg:px-24 flex justify-between items-center bg-white/80 backdrop-blur-xl shadow-sm rounded-full mx-4 mt-4 lg:mx-8 border border-[#FFDAC1]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FF9EAA] flex items-center justify-center shadow-md">
                <BookMarked className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-[#5C4033] tracking-tight">Yuyu Books</span>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-[#FFDAC1]/30 px-5 py-2 rounded-full">
              <Heart className="w-4 h-4 text-[#FF9EAA]" />
              <span className="text-sm font-medium text-[#5C4033]">{currentMotivation}</span>
              <Heart className="w-4 h-4 text-[#FF9EAA]" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#FFDAC1]/30 px-4 py-2 rounded-full"><Award className="w-4 h-4 text-[#FFB347]" /><span className="font-semibold text-[#5C4033] text-sm">{xp} XP</span></div>
              <div className="flex items-center gap-2 bg-[#FFDAC1]/30 px-4 py-2 rounded-full"><Flame className="w-4 h-4 text-[#FF9EAA]" /><span className="font-semibold text-[#5C4033] text-sm">{streak} day streak</span></div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="mb-10 space-y-5">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#8B5E3C]/50 w-5 h-5" />
                <input type="text" placeholder="Search for a magical story..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-5 py-5 bg-white border-2 border-[#FFDAC1] rounded-3xl focus:outline-none focus:border-[#FF9EAA] text-[#5C4033] placeholder-[#8B5E3C]/50 text-lg shadow-sm" />
              </div>
              
              <div className="flex justify-end">
                <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`px-6 py-3 rounded-full font-medium transition-all text-sm shadow-sm flex items-center gap-2 ${showFavoritesOnly ? 'bg-[#FF9EAA] text-white shadow-md' : 'bg-white text-[#5C4033] hover:bg-[#FFDAC1]/30 border border-[#FFDAC1]'}`}>
                  <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : ''}`} />
                  My Favorites
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredBooks.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} onToggleFavorite={handleToggleFavorite} isFavorite={favorites.includes(book.id)} progress={progress} onClick={handleOpenModal} />
              ))}
            </div>
            
            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#8B5E3C] text-lg">No books found. Try a different search!</p>
              </div>
            )}
            
            <BookModal book={selectedBook} isOpen={isModalOpen} onClose={handleCloseModal} progress={progress} onStartReading={handleStartReading} isFavorite={selectedBook ? favorites.includes(selectedBook.id) : false} onToggleFavorite={handleToggleFavorite} />
          </div>
        </>
      )}
    </div>
  );
};

export default Books;