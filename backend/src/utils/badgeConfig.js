
const GAMES_CONFIG = {
  candy_crush: {
    name: 'Candy Crush',
    icon: '🍬',
    color: '#FF9EAA',
    baseXP: 5,
    maxLevel: 50
  },
  shape_sorter: {
    name: 'Shape Match',
    icon: '🔺',
    color: '#B5EAD7',
    baseXP: 10,
    maxLevel: 30
  },
  number_pop: {
    name: 'Number Pop',
    icon: '🔢',
    color: '#FFDAC1',
    baseXP: 10,
    maxLevel: 30
  },
  tic_tac_toe: {
    name: 'Tic Tac Toe',
    icon: '❌',
    color: '#FFB347',
    baseXP: 15,
    maxLevel: 20
  },
  cloud_adventure: {
    name: 'Cloud Adventure',
    icon: '☁️',
    color: '#87CEEB',
    baseXP: 10,
    maxLevel: 40
  }
};

// Badge rules for each game
const BADGE_RULES = {
  candy_crush: [
    {
      name: '🍬 Candy Novice',
      icon: '🍬',
      type: 'score',
      threshold: 100,
      xpBonus: 50,
      description: 'Score 100 points in Candy Crush'
    },
    {
      name: '🍭 Candy Master',
      icon: '🍭',
      type: 'score',
      threshold: 500,
      xpBonus: 100,
      description: 'Score 500 points in Candy Crush'
    },
    {
      name: '🌈 Rainbow Crusher',
      icon: '🌈',
      type: 'score',
      threshold: 1000,
      xpBonus: 200,
      description: 'Score 1000 points in Candy Crush'
    },
    {
      name: '👑 Candy King',
      icon: '👑',
      type: 'level',
      threshold: 20,
      xpBonus: 500,
      description: 'Reach level 20 in Candy Crush'
    }
  ],
  shape_sorter: [
    {
      name: '🔺 Shape Learner',
      icon: '🔺',
      type: 'score',
      threshold: 50,
      xpBonus: 50,
      description: 'Score 50 points in Shape Match'
    },
    {
      name: '🔵 Shape Master',
      icon: '🔵',
      type: 'score',
      threshold: 200,
      xpBonus: 100,
      description: 'Score 200 points in Shape Match'
    },
    {
      name: '⭐ Shape Champion',
      icon: '⭐',
      type: 'score',
      threshold: 500,
      xpBonus: 200,
      description: 'Score 500 points in Shape Match'
    }
  ],
  number_pop: [
    {
      name: '🔢 Number Explorer',
      icon: '🔢',
      type: 'score',
      threshold: 50,
      xpBonus: 50,
      description: 'Score 50 points in Number Pop'
    },
    {
      name: '🧮 Number Wizard',
      icon: '🧮',
      type: 'score',
      threshold: 200,
      xpBonus: 100,
      description: 'Score 200 points in Number Pop'
    },
    {
      name: '🔢 Number Legend',
      icon: '🏆',
      type: 'score',
      threshold: 500,
      xpBonus: 200,
      description: 'Score 500 points in Number Pop'
    }
  ],
  tic_tac_toe: [
    {
      name: '❌ Tic Tac Rookie',
      icon: '❌',
      type: 'score',
      threshold: 3,
      xpBonus: 50,
      description: 'Win 3 games of Tic Tac Toe'
    },
    {
      name: '⭕ Tic Tac Champion',
      icon: '⭕',
      type: 'score',
      threshold: 10,
      xpBonus: 100,
      description: 'Win 10 games of Tic Tac Toe'
    },
    {
      name: '🏆 Tic Tac Legend',
      icon: '🏆',
      type: 'score',
      threshold: 20,
      xpBonus: 200,
      description: 'Win 20 games of Tic Tac Toe'
    }
  ],
  cloud_adventure: [
    {
      name: '☁️ Cloud Rider',
      icon: '☁️',
      type: 'score',
      threshold: 100,
      xpBonus: 50,
      description: 'Score 100 points in Cloud Adventure'
    },
    {
      name: '🌈 Rainbow Flyer',
      icon: '🌈',
      type: 'score',
      threshold: 300,
      xpBonus: 100,
      description: 'Score 300 points in Cloud Adventure'
    },
    {
      name: '⭐ Sky Champion',
      icon: '⭐',
      type: 'score',
      threshold: 600,
      xpBonus: 200,
      description: 'Score 600 points in Cloud Adventure'
    }
  ]
};

// Calculate XP based on game and score
const calculateExpForGame = (gameId, score) => {
  const config = GAMES_CONFIG[gameId];
  if (!config) return score;
  
  // Base XP + bonus based on score
  return Math.floor(score / 10) * config.baseXP;
};

module.exports = {
  GAMES_CONFIG,
  BADGE_RULES,
  calculateExpForGame
};