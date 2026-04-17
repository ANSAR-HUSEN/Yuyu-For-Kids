import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Heart, ChevronRight, MessageSquare, Plus, Clock, Archive, X, Menu } from 'lucide-react';
import yuyuImage from '../assets/yuyu.png';

const YuyuAIAssistant = ({ onBack, childName = "friend" }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const welcomeMessage = {
    id: 1,
    type: 'yuyu',
    content: "✨ Hi there! I'm Yuyu, your magical creative friend! ✨ What would you like to create today?",
    suggestions: [
      { icon: "✨", text: "Tell me a story" },
      { icon: "🎨", text: "Help me draw something" },
      { icon: "📝", text: "Make a poem for me" },
      { icon: "❓", text: "Answer my question" },
      { icon: "🎮", text: "Create a game idea" }
    ]
  };

  const mockConversations = [
    {
      id: 1001,
      title: "Dragon Story",
      messages: [
        { id: 1, type: 'yuyu', content: "✨ Hi there! I'm Yuyu, your magical creative friend! ✨ What would you like to create today?" },
        { id: 2, type: 'user', content: "Tell me a story about a friendly dragon" },
        { id: 3, type: 'yuyu', content: "📖 *A Magical Story Just for You!*\n\nOnce upon a time, there was a friendly dragon named Sparky who loved to eat rainbow berries and help children find their lost toys. Every morning, Sparky would fly over the village and wave his sparkly tail, making everyone smile! 🐉✨" }
      ],
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000
    },
    {
      id: 1002,
      title: "Drawing a Unicorn",
      messages: [
        { id: 1, type: 'yuyu', content: "✨ Hi there! I'm Yuyu, your magical creative friend! ✨ What would you like to create today?" },
        { id: 2, type: 'user', content: "Help me draw a unicorn" },
        { id: 3, type: 'yuyu', content: "🎨 *Let's Draw a MAGICAL UNICORN!*\n\n**Step 1:** Draw a big circle for the head\n**Step 2:** Add a pointy horn on top\n**Step 3:** Draw a soft mane with wavy lines\n**Step 4:** Add two big sparkly eyes\n**Step 5:** Color it with rainbow shades! 🦄✨" }
      ],
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 172800000
    },
    {
      id: 1003,
      title: "Space Question",
      messages: [
        { id: 1, type: 'yuyu', content: "✨ Hi there! I'm Yuyu, your magical creative friend! ✨ What would you like to create today?" },
        { id: 2, type: 'user', content: "Why is the sky blue?" },
        { id: 3, type: 'yuyu', content: "💡 *Why is the sky blue? Such a GREAT question!*\n\nImagine the sun sends us a giant box of crayons with ALL the colors! Blue light bounces off tiny air particles and spreads EVERYWHERE in the sky, which is why we see beautiful blue above us! 💙" }
      ],
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 259200000
    }
  ];

  useEffect(() => {
    const savedConversations = localStorage.getItem('yuyu_conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed);
      if (parsed.length > 0) {
        setCurrentConversationId(parsed[0].id);
        setMessages(parsed[0].messages);
      } else {
        createNewConversation();
      }
    } else {
      setConversations(mockConversations);
      setCurrentConversationId(mockConversations[0].id);
      setMessages(mockConversations[0].messages);
      localStorage.setItem('yuyu_conversations', JSON.stringify(mockConversations));
    }
  }, []);

  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      const updatedConversations = conversations.map(conv =>
        conv.id === currentConversationId
          ? { ...conv, messages: messages, updatedAt: Date.now() }
          : conv
      );
      setConversations(updatedConversations);
      localStorage.setItem('yuyu_conversations', JSON.stringify(updatedConversations));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createNewConversation = () => {
    const newId = Date.now();
    const newConversation = {
      id: newId,
      title: `New Chat ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      messages: [welcomeMessage],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const updated = [newConversation, ...conversations];
    setConversations(updated);
    setCurrentConversationId(newId);
    setMessages([welcomeMessage]);
    localStorage.setItem('yuyu_conversations', JSON.stringify(updated));
  };

  const loadConversation = (conversation) => {
    setCurrentConversationId(conversation.id);
    setMessages(conversation.messages);
    setIsTyping(false);
  };

  const deleteConversation = (id, e) => {
    e.stopPropagation();
    const updated = conversations.filter(conv => conv.id !== id);
    setConversations(updated);
    localStorage.setItem('yuyu_conversations', JSON.stringify(updated));
    
    if (currentConversationId === id) {
      if (updated.length > 0) {
        setCurrentConversationId(updated[0].id);
        setMessages(updated[0].messages);
      } else {
        createNewConversation();
      }
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString();
  };

  const generateResponse = async (userMessage, topic) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerMsg = userMessage.toLowerCase();
    
    if (topic === 'story' || lowerMsg.includes('story')) {
      return `📖 *A Magical Story Just for You!*\n\nOnce upon a time, in a land where cotton candy clouds floated in strawberry skies, a brave little adventurer named ${childName} discovered a hidden path made of rainbow crystals! 🌈\n\nAs ${childName} followed the sparkling trail, they met a gentle dragon who breathed stardust instead of fire. "The Whispering Woods need your help," the dragon said softly. "The Laughter Flowers have stopped giggling!"\n\n${childName} smiled bravely and promised to help. With a heart full of courage and a pocket full of dreams, the adventure began... ✨\n\n*Would you like me to continue the story? Just say "keep going"!* 🚀`;
    }
    
    if (topic === 'draw' || lowerMsg.includes('draw')) {
      return `🎨 *Let's Draw Something Amazing Together!*\n\nI'll teach you how to draw a MAGICAL RAINBOW DRAGON! 🐉🌈\n\n**Step 1:** Draw a big, friendly smile (a curved line like a banana) 🍌\n\n**Step 2:** Add two circles for eyes, and inside each circle, draw a tiny dot for sparkle eyes ✨👀\n\n**Step 3:** Draw two little bumps on top of the head for horns, and a wiggly line going down the back for spikes! 🦕\n\n**Step 4:** Now for the MAGIC PART - draw rainbow stripes across the dragon's back: red, orange, yellow, green, blue, purple! 🌈\n\n**Step 5:** Add two wings that look like giant butterfly wings, and don't forget a happy little tail! 🦋\n\n**Pro Tip:** Use your favorite colors and don't worry about being perfect - every dragon is unique and special, just like YOU! 💫\n\n*Would you like me to help you draw something else?* 🎨`;
    }
    
    if (topic === 'poem' || lowerMsg.includes('poem') || lowerMsg.includes('rhyme')) {
      return `📝 *A Sweet Little Poem Just for You*\n\n*"The Magic of Being You"*\n\nIn a world of wonder, bright and new,\nThere's something special — and that is YOU! ✨\n\nYour smile can light the darkest night,\nYour laughter makes the stars shine bright. ⭐\n\nEvery dream you dare to dream,\nCreates a magical, sparkling stream. 🌊\n\nSo paint your world with joy and glee,\nThe most amazing YOU, you'll always be! 🎨\n\n*Did that make you smile? I can make more poems about ANYTHING you like! Just tell me what you love — cats, stars, rainbows, or something else!* 📖💫`;
    }
    
    if (topic === 'question' || lowerMsg.includes('why') || lowerMsg.includes('how') || lowerMsg.includes('what')) {
      if (lowerMsg.includes('sky') && lowerMsg.includes('blue')) {
        return `💡 *Why is the sky blue? Such a GREAT question!*\n\nImagine the sun sends us a giant box of crayons with ALL the colors - red, orange, yellow, green, blue, indigo, violet! 🌈\n\nWhen sunlight travels to Earth, the blue crayon is the bounciest of them all! Blue light bounces off tiny air particles and spreads EVERYWHERE in the sky, which is why we see beautiful blue above us! 💙\n\n**Fun Fact:** At sunrise and sunset, the sun is lower in the sky, so the light travels through MORE air. That's when we see gorgeous oranges, pinks, and purples! 🌅\n\n*Do you have another curious question? I LOVE answering "why"!* 🤔✨`;
      }
      return `💡 *What a WONDERFUL question!*\n\nYou know what? Your curiosity makes you a TRUE explorer! 🗺️✨\n\nThe answer is: Our world is full of amazing magic and science working together! 🌍\n\n**Here's a little secret:** Even grown-ups are still discovering new answers every single day. That's what makes learning so exciting!\n\n*Could you tell me a little more about what you're wondering? The more details you share, the better answer I can give you!* 🧠💫`;
    }
    
    if (topic === 'game' || lowerMsg.includes('game')) {
      return `🎮 *Let's Create an AMAZING Game Together!*\n\nI've invented a game just for you called...\n\n**"THE WHISPERING FOREST ADVENTURE"** 🌲✨\n\n**The Story:** You're a young guardian of the magical Whispering Forest, where every flower, tree, and creature can talk!\n\n**How to Play:**\n\n🎯 **Quest 1 - Find the Giggling Flowers:** Three flowers have lost their giggle! Walk around your room and "listen" for where the giggles might be hiding. When you find one, do a silly dance! 💃\n\n🎯 **Quest 2 - Help the Shy Stars:** Some stars fell from the sky and are too shy to shine! Draw 5 stars on paper and give each one a funny face to make them smile again! ⭐\n\n🎯 **Quest 3 - The Moon's Riddle:** The moon whispers a riddle: *"I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?"* (Answer: A map! 🗺️)\n\n**Bonus Power:** Every time you complete a quest, you earn a "Sparkle Point"! Collect 5 Sparkle Points and you become a MASTER GUARDIAN with a magical rainbow cape! 🦸‍♀️🦸‍♂️\n\n*Would you like me to create ANOTHER game idea? Or help you build this one?* 🎲✨`;
    }
    
    return `✨ *Hello ${childName}!* ✨\n\nI'm so happy you're here! I can help you with:\n\n📖 Telling wonderful stories\n📝 Creating happy poems\n❓ Answering curious questions\n🎮 Inventing fun games\n\n*What would you like to create today? Just type your idea or click one of the buttons above!* 💫`;
  };

  const handleSend = async (customMessage = null, topic = null) => {
    const userText = customMessage || inputValue.trim();
    if (!userText || isTyping) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: userText
    };
    setMessages(prev => [...prev, userMessage]);
    
    if (!customMessage) {
      setInputValue('');
    }
    
    setIsTyping(true);
    const responseContent = await generateResponse(userText, topic);
    setIsTyping(false);
    
    const yuyuMessage = {
      id: Date.now() + 1,
      type: 'yuyu',
      content: responseContent
    };
    setMessages(prev => [...prev, yuyuMessage]);
  };

  const handleSuggestionClick = (suggestionText, topic) => {
    handleSend(suggestionText, topic);
  };

  const clearChat = () => {
    setMessages([welcomeMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, type: "spring", stiffness: 300 } }
  };

  const hasHistory = conversations.length > 0;

  return (
    <div className="h-screen overflow-hidden bg-cream relative">
      
      {/* Sidebar - Slides in from left */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl z-40 shadow-2xl border-r border-gold/20 flex flex-col"
          >
            <div className="p-4 border-b border-gold/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-softPink to-gold flex items-center justify-center">
                  <Archive size={16} className="text-white" />
                </div>
                <h2 className="font-bold text-darkBrown">Past Chats</h2>
                {conversations.length > 0 && (
                  <span className="text-xs bg-blush px-2 py-0.5 rounded-full text-warmBrown">
                    {conversations.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={createNewConversation}
                  className="p-2 rounded-full hover:bg-blush transition-colors"
                  title="New Chat"
                >
                  <Plus size={18} className="text-warmBrown" />
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-blush transition-colors"
                >
                  <X size={18} className="text-warmBrown" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={32} className="mx-auto text-warmBrown/30 mb-2" />
                  <p className="text-sm text-warmBrown/50">No chats yet</p>
                  <button
                    onClick={createNewConversation}
                    className="mt-3 text-xs text-softPink hover:text-gold"
                  >
                    Start a new chat +
                  </button>
                </div>
              ) : (
                conversations.map(conv => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => loadConversation(conv)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                      currentConversationId === conv.id
                        ? 'bg-gradient-to-r from-softPink/20 to-gold/20 border border-gold/30 shadow-sm'
                        : 'hover:bg-blush/30 border border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare size={12} className={currentConversationId === conv.id ? 'text-gold' : 'text-warmBrown/50'} />
                          <p className="text-sm font-medium text-darkBrown truncate">
                            {conv.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-warmBrown/50">
                          <Clock size={10} />
                          <span>{formatDate(conv.updatedAt)}</span>
                          <span>•</span>
                          <span>{conv.messages.length} msgs</span>
                        </div>
                        <p className="text-xs text-warmBrown/60 truncate mt-1">
                          {conv.messages[conv.messages.length - 1]?.content?.slice(0, 40)}...
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="p-1 rounded-full hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-gold/20">
              <div className="flex items-center gap-2 text-xs text-warmBrown/60">
                <Heart size={12} />
                <span>Your magical conversations are saved here</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Frame - shifts with sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 w-12 md:w-20 pointer-events-none z-20 transition-all duration-300 ${sidebarOpen ? 'lg:left-[320px]' : ''}`}>
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-softPink to-gold opacity-60" />
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-softPink/30 to-gold/30" />
        <div className="absolute left-3 top-8 w-8 h-12 border-l-2 border-t-2 border-gold/50 rounded-tl-2xl" />
        <div className="absolute left-5 top-12 w-2 h-2 rounded-full bg-gold animate-pulse" />
        <div className="absolute left-3 top-20 w-4 h-4 rounded-full border border-softPink/60" />
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 space-y-4">
          <div className="w-2 h-2 rotate-45 bg-gold/40 border border-gold/60" />
          <div className="w-3 h-3 rotate-45 bg-softPink/30 border border-softPink/50 mt-3" />
          <div className="w-2 h-2 rotate-45 bg-gold/40 border border-gold/60 mt-3" />
        </div>
        <div className="absolute left-3 bottom-8 w-8 h-12 border-l-2 border-b-2 border-gold/50 rounded-bl-2xl" />
        <div className="absolute left-5 bottom-20 w-2 h-2 rounded-full bg-softPink animate-pulse" />
        <div className="absolute left-3 bottom-32 w-3 h-3 rounded-full border border-gold/50" />
        <div className="absolute left-5 top-1/3 w-1.5 h-1.5 rounded-full bg-gold/40" />
        <div className="absolute left-5 bottom-1/3 w-1.5 h-1.5 rounded-full bg-gold/40" />
      </div>
      
      {/* Right Frame */}
      <div className="fixed right-0 top-0 bottom-0 w-12 md:w-20 pointer-events-none z-20">
        <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-softPink to-gold opacity-60" />
        <div className="absolute right-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-softPink/30 to-gold/30" />
        <div className="absolute right-3 top-8 w-8 h-12 border-r-2 border-t-2 border-gold/50 rounded-tr-2xl" />
        <div className="absolute right-5 top-12 w-2 h-2 rounded-full bg-gold animate-pulse" />
        <div className="absolute right-3 top-20 w-4 h-4 rounded-full border border-softPink/60" />
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 space-y-4">
          <div className="w-2 h-2 rotate-45 bg-gold/40 border border-gold/60" />
          <div className="w-3 h-3 rotate-45 bg-softPink/30 border border-softPink/50 mt-3" />
          <div className="w-2 h-2 rotate-45 bg-gold/40 border border-gold/60 mt-3" />
        </div>
        <div className="absolute right-3 bottom-8 w-8 h-12 border-r-2 border-b-2 border-gold/50 rounded-br-2xl" />
        <div className="absolute right-5 bottom-20 w-2 h-2 rounded-full bg-softPink animate-pulse" />
        <div className="absolute right-3 bottom-32 w-3 h-3 rounded-full border border-gold/50" />
        <div className="absolute right-5 top-1/3 w-1.5 h-1.5 rounded-full bg-gold/40" />
        <div className="absolute right-5 bottom-1/3 w-1.5 h-1.5 rounded-full bg-gold/40" />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-softPink/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-mint/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content - shifts when sidebar opens */}
      <motion.div 
        className="h-full flex flex-col"
        animate={{ 
          paddingLeft: sidebarOpen ? '320px' : '0px'
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <nav className="relative z-30 px-6 py-4 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm rounded-full mx-6 mt-4 border border-peach">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-warmBrown hover:text-softPink transition-colors"
            >
              <ChevronRight size={18} className="rotate-180" />
              <span className="text-sm font-medium hidden sm:inline">Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-gold/30 mx-1 hidden sm:block" />
            
            {/* Sidebar Toggle Button in Header */}
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-2 text-warmBrown hover:text-softPink transition-colors px-2 py-1 rounded-lg hover:bg-blush/50"
              title={sidebarOpen ? "Close history" : "Open history"}
            >
              <Menu size={20} />
              <span className="text-sm font-medium hidden sm:inline">
                {sidebarOpen ? "Close History" : "Chat History"}
              </span>
              {hasHistory && !sidebarOpen && (
                <span className="text-xs bg-gold/20 px-1.5 py-0.5 rounded-full text-gold">
                  {conversations.length}
                </span>
              )}
            </button>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-softPink to-gold flex items-center justify-center shadow-md ml-2">
              <img
                src={yuyuImage}
                alt="Yuyu"
                className="w-9 h-9 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%23FFB347" stroke="%23FFB347"%3E%3Cpath d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"%3E%3C/path%3E%3C/svg%3E';
                }}
              />
            </div>
            <span className="font-bold text-xl text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>Yuyu AI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={clearChat}
              className="p-2 rounded-full hover:bg-blush transition-colors"
              aria-label="Clear chat"
            >
              <Trash2 size={20} className="text-warmBrown hover:text-softPink" />
            </button>
          </div>
        </nav>

        {/* Main Chat Area */}
        <div className="relative z-10 flex flex-col h-[calc(100vh-80px)] overflow-hidden">
          
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-12 lg:px-24 py-6">
            <div className="max-w-2xl mx-auto space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'yuyu' && (
                      <div className="flex-shrink-0 mr-2">
                        <img
                          src={yuyuImage}
                          alt="Yuyu"
                          className="w-7 h-7 rounded-full border border-gold shadow-sm object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="%23FFB347" stroke="%23FFB347"%3E%3Cpath d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"%3E%3C/path%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                        message.type === 'user'
                          ? 'bg-[#8B0000] text-white'
                          : 'bg-blush text-darkBrown font-semibold'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                        {message.content.split('\n').map((line, i) => {
                          if (line.startsWith('*') && line.endsWith('*')) {
                            return <p key={i} className="font-bold text-base mt-2 first:mt-0">{line.slice(1, -1)}</p>;
                          }
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={i} className="font-bold text-gold mt-2 first:mt-0">{line.slice(2, -2)}</p>;
                          }
                          return <p key={i} className="my-1">{line}</p>;
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex-shrink-0 mr-2">
                      <img
                        src={yuyuImage}
                        alt="Yuyu is thinking"
                        className="w-7 h-7 rounded-full border border-gold shadow-sm object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="%23FFB347" stroke="%23FFB347"%3E%3Cpath d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"%3E%3C/path%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <div className="bg-blush rounded-2xl px-5 py-3 shadow-md">
                      <div className="flex gap-1.5">
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                          className="w-2.5 h-2.5 bg-softPink rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                          className="w-2.5 h-2.5 bg-softPink rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                          className="w-2.5 h-2.5 bg-softPink rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {messages.length === 1 && messages[0].suggestions && (
            <div className="flex-shrink-0 px-4 md:px-12 lg:px-24 pb-3">
              <div className="max-w-2xl mx-auto">
                <p className="text-xs text-warmBrown mb-2 text-center">Try asking me:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {messages[0].suggestions.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        let topic = '';
                        if (suggestion.text.includes('story')) topic = 'story';
                        else if (suggestion.text.includes('draw')) topic = 'draw';
                        else if (suggestion.text.includes('poem')) topic = 'poem';
                        else if (suggestion.text.includes('question')) topic = 'question';
                        else if (suggestion.text.includes('game')) topic = 'game';
                        handleSuggestionClick(suggestion.text, topic);
                      }}
                      className="px-4 py-2 bg-lightYellow border border-peach rounded-full text-sm text-warmBrown hover:bg-softPink hover:text-white transition-all duration-200 shadow-sm"
                    >
                      <span className="mr-1">{suggestion.icon}</span>
                      {suggestion.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex-shrink-0 bg-gradient-to-t from-cream via-cream to-transparent pt-2 pb-6 px-4 md:px-12 lg:px-24">
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.slice(0, 500))}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    rows={1}
                    disabled={isTyping}
                    className="w-full px-4 py-3 bg-peach border-2 border-peach rounded-2xl focus:border-softPink focus:outline-none text-darkBrown placeholder:text-warmBrown/50 resize-none font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Comic Neue', cursive" }}
                  />
                  {inputValue.length === 500 && (
                    <p className="text-xs text-warmBrown/60 mt-1 text-right">Max 500 characters reached</p>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  className={`p-3 rounded-2xl transition-all ${
                    inputValue.trim() && !isTyping
                      ? 'bg-gradient-to-r from-softPink to-gold shadow-md hover:shadow-lg'
                      : 'bg-peach/50 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                >
                  <Send size={20} className={inputValue.trim() && !isTyping ? 'text-white' : 'text-warmBrown/50'} />
                </motion.button>
              </div>
              
              <p className="text-xs text-center text-warmBrown/40 mt-3 flex items-center justify-center gap-1">
                <Heart size={10} />
                Yuyu is here to help you create amazing things!
                <Heart size={10} />
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default YuyuAIAssistant;