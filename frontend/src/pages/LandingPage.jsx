import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Star, BookOpen, Puzzle, Palette, Bot, BarChart3, 
  Award, ChevronRight, Play, Zap, TrendingUp,
Trophy,  Heart, 
} from 'lucide-react';
import yuyu from '../assets/yuyu.png'; 

const FeatureCard = ({ icon: Icon, title, description, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: delay || 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative overflow-hidden rounded-3xl p-6 shadow-md bg-cream"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, ${color}15 0%, transparent 50%)`,
          border: '2px solid rgba(0,0,0,0.08)',
        }}
        animate={isHovered ? { scale: 0.98, y: -2 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 15, duration: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{ opacity: isHovered ? 0.3 : 0.05 }}
          transition={{ duration: 0.2 }}
          style={{ background: `radial-gradient(circle at 70% 80%, ${color}40 0%, transparent 70%)` }}
        />

        <div className="absolute top-4 right-4 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-black/60" />
          <div className="w-2 h-2 rounded-full bg-black/60" />
          <motion.div
            animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
            className="w-2.5 h-2.5 rounded-full bg-pink-400"
          />
        </div>

        <div className="absolute top-6 left-3 text-sm opacity-30">
          <Heart size={10} fill="#FF9EAA" color="#FF9EAA" />
        </div>
        <div className="absolute bottom-4 right-5 text-xs opacity-25">✦</div>
        <div className="absolute top-1/3 right-2 text-xs opacity-20">⭐</div>
        <div className="absolute bottom-8 left-4 text-xs opacity-20">❤</div>

        <div className="flex justify-center mb-5">
          <motion.div
            animate={isHovered ? { scale: 1.05, rotate: 3 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
              <div className="absolute top-1 left-2 w-6 h-3 bg-white/40 rounded-full blur-[1px]" />
            </div>
            <div 
              className="flex items-center justify-center w-20 h-20 rounded-full shadow-md bg-white"
              style={{ 
                border: `3px solid ${color}`,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1), inset 0 1px 2px white',
              }}
            >
              <Icon size={36} style={{ color: color }} />
            </div>
          </motion.div>
        </div>

        <h3 className="text-xl font-bold text-center mb-2 text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>
          {title}
        </h3>
        <p className="text-center text-sm font-medium px-2 text-warmBrown">
          {description}
        </p>

        <div className="absolute bottom-12 left-2 w-6 h-3 rounded-full bg-pink-200/40 blur-sm" />
        <div className="absolute bottom-12 right-2 w-6 h-3 rounded-full bg-pink-200/40 blur-sm" />
      </motion.div>
    </motion.div>
  );
};

const TestimonialCard = ({ name, childName, content, rating }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative overflow-hidden rounded-[2rem] p-6 shadow-md bg-cream"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, #FFD1DC15 0%, transparent 50%)`,
          border: '2px solid rgba(0,0,0,0.08)',
        }}
        animate={isHovered ? { scale: 0.98, y: -2 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 15, duration: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 rounded-[2rem] pointer-events-none"
          animate={{ opacity: isHovered ? 0.3 : 0.05 }}
          transition={{ duration: 0.2 }}
          style={{ background: `radial-gradient(circle at 70% 80%, #FFD1DC40 0%, transparent 70%)` }}
        />

        <div className="absolute top-4 right-4 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-black/60" />
          <div className="w-2 h-2 rounded-full bg-black/60" />
          <motion.div
            animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
            className="w-2.5 h-2.5 rounded-full bg-pink-400"
          />
        </div>

        <div className="absolute top-6 left-3 text-sm opacity-30">
          <Heart size={10} fill="#FF9EAA" color="#FF9EAA" />
        </div>
        <div className="absolute bottom-4 right-5 text-xs opacity-25">✦</div>
        <div className="absolute top-1/3 right-2 text-xs opacity-20">⭐</div>

        <div className="flex gap-1 mb-4 justify-center">
          {[...Array(rating)].map((_, i) => (
            <motion.div
              key={i}
              animate={isHovered ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
            >
              <Star key={i} size={16} fill="#FFB347" stroke="#FFB347" />
            </motion.div>
          ))}
        </div>

        <p className="text-gray-700 mb-4 italic text-center text-sm leading-relaxed">"{content}"</p>
        
        <div className="flex items-center justify-center gap-3 mt-2">
          <motion.div 
            className="w-10 h-10 rounded-full bg-softPink flex items-center justify-center text-white font-bold shadow-sm"
            animate={isHovered ? { scale: 1.05, rotate: 5 } : { scale: 1, rotate: 0 }}
          >
            {name[0]}
          </motion.div>
          <div>
            <p className="font-bold text-sm text-darkBrown">{name}</p>
            <p className="text-xs text-gray-400">Parent of {childName}</p>
          </div>
        </div>

        <div className="absolute bottom-12 left-2 w-6 h-3 rounded-full bg-pink-200/40 blur-sm" />
        <div className="absolute bottom-12 right-2 w-6 h-3 rounded-full bg-pink-200/40 blur-sm" />
      </motion.div>
    </motion.div>
  );
};

const LandingPage = () => {
  const features = [
    { icon: Puzzle, title: "Learning Games", description: "Games that make learning fun!", color: "#FF9EAA" },
    { icon: BookOpen, title: "AI Storytelling", description: "Stories generated just for your child", color: "#B5EAD7" },
    { icon: Zap, title: "Fun Quizzes", description: "Quizzes that grow with your child", color: "#FFDAC1" },
    { icon: TrendingUp, title: "Personalized Learning", description: "Smart AI that adapts to their progress", color: "#FFB347" },
    { icon: Palette, title: "Creativity Mode", description: "Draw, color, and create amazing art", color: "#FF9EAA" },
    { icon: Bot, title: "Safe AI Chat", description: "Friendly companion that's child-safe", color: "#B5EAD7" },
    { icon: BarChart3, title: "Progress Tracking", description: "See skills grow over time", color: "#FFDAC1" },
    { icon: Award, title: "Rewards System", description: "Earn stars, badges & achievements", color: "#FFB347" }
  ];

  const steps = [
    { icon: Play, title: "Start Playing", description: "Choose from games, stories, or drawing" },
    { icon: Bot, title: "AI Learns", description: "Our AI adapts to their skill level" },
    { icon: Trophy, title: "Grow & Win", description: "Earn rewards while learning" }
  ];

  const testimonials = [
    { name: "Sarah Johnson", childName: "Emma", content: "My daughter loves the storytelling feature! She's reading more than ever.", rating: 5 },
    { name: "Michael Chen", childName: "Leo", content: "The math games have improved his grades significantly. Highly recommended!", rating: 5 },
    { name: "Emily Rodriguez", childName: "Sophia", content: "Safe, educational, and fun - everything I want in a learning app.", rating: 5 }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream">
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      <nav className="relative z-20 px-6 py-4 md:px-12 lg:px-24 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm rounded-full mx-6 mt-4 border border-peach">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-softPink flex items-center justify-center">
            <span className="text-white font-bold text-lg">Y</span>
          </div>
          <span className="font-bold text-xl text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>Yuyu AI</span>
        </div>
        <div className="hidden md:flex gap-8">
          {['Features', 'How It Works', 'Testimonials'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="transition-transform hover:scale-105 font-medium text-warmBrown">
              {item}
            </a>
          ))}
        </div>
        <Link to="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-full text-white font-semibold shadow-md bg-softPink"
          >
            Get Started
          </motion.button>
        </Link>
      </nav>

      <section className="relative z-10 px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>
              Where Kids{' '}
              <span className="relative inline-block">
                Learn
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="absolute bottom-2 left-0 h-3 rounded-full -z-10 bg-softPink/40"
                />
              </span>
              {' '}& Play
            </h1>
            
            <p className="text-lg mb-8 leading-relaxed text-warmBrown">
              The safest AI playground where children aged 5-12 develop creativity, 
              logic, and problem-solving skills through magical learning experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full text-white font-bold text-lg shadow-xl flex items-center justify-center gap-2 bg-softPink"
              >
                Start Learning <ChevronRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full font-bold text-lg border-2 flex items-center justify-center gap-2 border-warmBrown text-warmBrown"
              >
                <Play size={20} /> Explore Games
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="relative"
          >
            <div className="relative z-10">
              <img 
                src={yuyu} 
                alt="Yuyu AI Mascot" 
                className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white object-cover"
                style={{ maxHeight: '400px' }}
              />
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white rounded-full p-3 shadow-xl border-2 border-gold"
              >
                <Award size={32} className="text-gold" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -15, 0], transition: { delay: 1, repeat: Infinity } }}
                className="absolute -bottom-6 -left-6 bg-white rounded-full p-3 shadow-xl border-2 border-softPink"
              >
                <Bot size={32} className="text-softPink" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="relative z-10 px-6 md:px-12 lg:px-24 py-20">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 text-darkBrown"
            style={{ fontFamily: "'Comic Neue', cursive" }}
          >
            Magical Learning Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg max-w-2xl mx-auto text-warmBrown"
          >
            Everything your child needs to grow, create, and succeed
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.08} />
          ))}
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 px-6 md:px-12 lg:px-24 py-20 bg-peach">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>
            How It Works
          </h2>
          <p className="text-lg text-warmBrown">Three simple steps to endless learning fun</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md bg-white border-2 border-gold">
                <step.icon size={40} className="text-softPink" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-darkBrown">{step.title}</h3>
              <p className="text-warmBrown">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="testimonials" className="relative z-10 px-6 md:px-12 lg:px-24 py-20 bg-peach">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>
            What Parents Say
          </h2>
          <p className="text-lg text-warmBrown">Join thousands of happy families</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </section>

      <footer className="relative z-10 px-6 md:px-12 lg:px-24 py-12 border-t border-peach bg-cream">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-softPink flex items-center justify-center text-white text-sm font-bold">
                Y
              </div>
              <span className="font-bold text-xl text-darkBrown" style={{ fontFamily: "'Comic Neue', cursive" }}>Yuyu AI</span>
            </div>
            <p className="text-sm text-warmBrown">Making learning magical for kids worldwide.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-darkBrown">Product</h4>
            <ul className="space-y-2 text-sm text-warmBrown">
              <li>Features</li>
              <li>Pricing</li>
              <li>Demo</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-darkBrown">Company</h4>
            <ul className="space-y-2 text-sm text-warmBrown">
              <li>About Us</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-darkBrown">Legal</h4>
            <ul className="space-y-2 text-sm text-warmBrown">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
              <li>Safety Guidelines</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs mt-8 pt-8 border-t border-peach text-warmBrown">
          © 2026 Yuyu AI. All rights reserved. A safe AI playground for young minds.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;