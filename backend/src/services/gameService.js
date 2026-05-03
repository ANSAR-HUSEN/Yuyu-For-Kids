const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { GAMES_CONFIG, BADGE_RULES, calculateExpForGame } = require('../utils/badgeConfig');

// In-memory cache for high scores (use Redis in production)
const highScoreCache = new Map();

const gameService = {
  // Save progress for any game
  saveProgress: async ({ childId, gameId, score, pointsEarned, level, movesUsed, timeSpent, metadata }) => {
    
    // 1. Validate game exists
    if (!GAMES_CONFIG[gameId]) {
      throw new Error(`Invalid game ID: ${gameId}`);
    }
    
    // 2. Calculate XP if not provided
    let finalPoints = pointsEarned;
    if (!finalPoints && score) {
      finalPoints = calculateExpForGame(gameId, score);
    }
    
    // 3. Update child stats
    const child = await prisma.child.update({
      where: { id: childId },
      data: {
        totalPoints: { increment: finalPoints || 0 },
        gamesPlayed: { increment: 1 },
        lastActive: new Date()
      }
    });
    
    // 4. Update game progress
    const existingProgress = await prisma.progress.findFirst({
      where: {
        childId: childId,
        skillType: gameId
      }
    });
    
    let progress;
    if (existingProgress) {
      progress = await prisma.progress.update({
        where: { id: existingProgress.id },
        data: {
          exp: { increment: finalPoints || 0 },
          level: level || existingProgress.level
        }
      });
    } else {
      progress = await prisma.progress.create({
        data: {
          childId: childId,
          skillType: gameId,
          exp: finalPoints || 0,
          level: level || 1
        }
      });
    }
    
    // 5. Update high score
    const isNewHighScore = await gameService.updateHighScore(childId, gameId, score);
    
    // 6. Check and award badges
    const awardedBadges = await gameService.checkAndAwardBadges(childId, gameId, score, finalPoints);
    
    // 7. Update streak
    const streak = await gameService.updateStreak(childId);
    
    // 8. Save game-specific metadata (optional)
    if (metadata) {
      await gameService.saveGameMetadata(childId, gameId, metadata);
    }
    
    return {
      totalXP: child.totalPoints + (finalPoints || 0),
      gamesPlayed: child.gamesPlayed + 1,
      progress: {
        level: progress.level,
        exp: progress.exp,
        nextLevelExp: progress.level * 100
      },
      isNewHighScore,
      badges: awardedBadges,
      streak
    };
  },
  
  // Get all games progress for a child
  getAllGamesProgress: async (childId) => {
    // Get child data
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        progress: true,
        rewards: true
      }
    });
    
    if (!child) {
      throw new Error('Child not found');
    }
    
    // Build progress for each game
    const gamesProgress = {};
    for (const [gameId, config] of Object.entries(GAMES_CONFIG)) {
      const gameProgress = child.progress.find(p => p.skillType === gameId);
      const highScore = await gameService.getHighScore(childId, gameId);
      
      gamesProgress[gameId] = {
        name: config.name,
        icon: config.icon,
        color: config.color,
        level: gameProgress?.level || 1,
        exp: gameProgress?.exp || 0,
        highScore: highScore || 0,
        nextLevelExp: (gameProgress?.level || 1) * 100,
        progressPercent: gameProgress ? Math.min(100, (gameProgress.exp / ((gameProgress.level || 1) * 100)) * 100) : 0
      };
    }
    
    return {
      child: {
        id: child.id,
        name: child.name,
        age: child.age,
        avatar: child.avatar,
        totalPoints: child.totalPoints,
        gamesPlayed: child.gamesPlayed,
        badgesEarned: child.badgesEarned,
        streak: child.streak
      },
      games: gamesProgress,
      badges: child.rewards,
      totalGames: Object.keys(GAMES_CONFIG).length,
      completedGames: child.progress.filter(p => p.level >= 10).length
    };
  },
  
  // Get specific game progress
  getGameProgress: async (childId, gameId) => {
    if (!GAMES_CONFIG[gameId]) {
      throw new Error(`Invalid game ID: ${gameId}`);
    }
    
    const progress = await prisma.progress.findFirst({
      where: {
        childId: childId,
        skillType: gameId
      }
    });
    
    const highScore = await gameService.getHighScore(childId, gameId);
    
    return {
      gameId,
      gameName: GAMES_CONFIG[gameId].name,
      level: progress?.level || 1,
      exp: progress?.exp || 0,
      highScore: highScore || 0,
      nextLevelExp: (progress?.level || 1) * 100,
      progressPercent: progress ? Math.min(100, (progress.exp / ((progress.level || 1) * 100)) * 100) : 0
    };
  },
  
  // Get child's total stats
  getChildStats: async (childId) => {
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        progress: true,
        rewards: true
      }
    });
    
    if (!child) {
      throw new Error('Child not found');
    }
    
    // Calculate total exp across all games
    const totalExp = child.progress.reduce((sum, p) => sum + p.exp, 0);
    
    // Calculate average level
    const avgLevel = child.progress.length > 0 
      ? Math.round(child.progress.reduce((sum, p) => sum + p.level, 0) / child.progress.length)
      : 1;
    
    return {
      child: {
        id: child.id,
        name: child.name,
        age: child.age,
        avatar: child.avatar,
        totalPoints: child.totalPoints,
        gamesPlayed: child.gamesPlayed,
        badgesEarned: child.badgesEarned,
        streak: child.streak,
        lastActive: child.lastActive
      },
      stats: {
        totalExp,
        averageLevel: avgLevel,
        gamesCompleted: child.progress.filter(p => p.level >= 10).length,
        totalBadges: child.rewards.length
      },
      recentBadges: child.rewards.slice(-5)
    };
  },
  
  // Get leaderboard for a game
  getLeaderboard: async (gameId, limit = 10) => {
    if (!GAMES_CONFIG[gameId]) {
      throw new Error(`Invalid game ID: ${gameId}`);
    }
    
    // Get all children with their progress for this game
    const children = await prisma.child.findMany({
      include: {
        progress: {
          where: { skillType: gameId }
        }
      },
      orderBy: {
        totalPoints: 'desc'
      },
      take: limit
    });
    
    const leaderboard = children.map((child, index) => {
      const gameProgress = child.progress[0];
      return {
        rank: index + 1,
        childId: child.id,
        childName: child.name,
        avatar: child.avatar,
        level: gameProgress?.level || 1,
        exp: gameProgress?.exp || 0,
        totalPoints: child.totalPoints
      };
    });
    
    return { gameId, gameName: GAMES_CONFIG[gameId].name, leaderboard };
  },
  
  // Update high score
  updateHighScore: async (childId, gameId, score) => {
    const key = `${childId}:${gameId}:highscore`;
    const currentHigh = highScoreCache.get(key) || 0;
    
    if (score > currentHigh) {
      highScoreCache.set(key, score);
      // Also save to database for persistence
      await prisma.$executeRaw`
        INSERT INTO "high_scores" (child_id, game_id, score, created_at)
        VALUES (${childId}, ${gameId}, ${score}, NOW())
        ON CONFLICT (child_id, game_id) 
        DO UPDATE SET score = EXCLUDED.score, updated_at = NOW()
      `;
      return true;
    }
    return false;
  },
  
  // Get high score
  getHighScore: async (childId, gameId) => {
    const key = `${childId}:${gameId}:highscore`;
    if (highScoreCache.has(key)) {
      return highScoreCache.get(key);
    }
    
    // Try to get from database
    const result = await prisma.$queryRaw`
      SELECT score FROM high_scores 
      WHERE child_id = ${childId} AND game_id = ${gameId}
      LIMIT 1
    `;
    
    const highScore = result[0]?.score || 0;
    highScoreCache.set(key, highScore);
    return highScore;
  },
  
  // Check and award badges
  checkAndAwardBadges: async (childId, gameId, score, pointsEarned) => {
    const awardedBadges = [];
    
    // Get existing badges
    const existingBadges = await prisma.reward.findMany({
      where: { childId: childId }
    });
    const existingBadgeNames = new Set(existingBadges.map(b => b.badgeName));
    
    // Get badge rules for this game
    const rules = BADGE_RULES[gameId] || [];
    
    for (const rule of rules) {
      let conditionMet = false;
      
      if (rule.type === 'score') {
        conditionMet = score >= rule.threshold;
      } else if (rule.type === 'xp') {
        conditionMet = pointsEarned >= rule.threshold;
      } else if (rule.type === 'level') {
        const progress = await prisma.progress.findFirst({
          where: { childId: childId, skillType: gameId }
        });
        conditionMet = (progress?.level || 1) >= rule.threshold;
      }
      
      if (conditionMet && !existingBadgeNames.has(rule.name)) {
        const badge = await prisma.reward.create({
          data: {
            childId: childId,
            badgeName: rule.name
          }
        });
        
        awardedBadges.push({
          name: rule.name,
          icon: rule.icon,
          xpBonus: rule.xpBonus,
          description: rule.description
        });
        
        // Award XP bonus for badge
        if (rule.xpBonus > 0) {
          await prisma.child.update({
            where: { id: childId },
            data: { totalPoints: { increment: rule.xpBonus } }
          });
        }
        
        // Update badges earned count
        await prisma.child.update({
          where: { id: childId },
          data: { badgesEarned: { increment: 1 } }
        });
      }
    }
    
    return awardedBadges;
  },
  
  // Award badge manually
  awardBadge: async (childId, badgeName, source = 'manual') => {
    // Check if badge already exists
    const existing = await prisma.reward.findFirst({
      where: {
        childId: childId,
        badgeName: badgeName
      }
    });
    
    if (existing) {
      return { alreadyAwarded: true, badge: existing };
    }
    
    const badge = await prisma.reward.create({
      data: {
        childId: childId,
        badgeName: badgeName
      }
    });
    
    // Update badges earned count
    await prisma.child.update({
      where: { id: childId },
      data: { badgesEarned: { increment: 1 } }
    });
    
    return { alreadyAwarded: false, badge };
  },
  
  // Update streak
  updateStreak: async (childId) => {
    const child = await prisma.child.findUnique({
      where: { id: childId }
    });
    
    if (!child) return 0;
    
    const today = new Date().toDateString();
    const lastActive = child.lastActive ? new Date(child.lastActive).toDateString() : null;
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = 1;
      if (lastActive === yesterday.toDateString()) {
        newStreak = (child.streak || 0) + 1;
      }
      
      await prisma.child.update({
        where: { id: childId },
        data: { streak: newStreak }
      });
      
      // Award streak badges
      if (newStreak === 7) {
        await gameService.awardBadge(childId, '📅 Weekly Warrior', 'streak');
      } else if (newStreak === 30) {
        await gameService.awardBadge(childId, '🌟 Monthly Master', 'streak');
      } else if (newStreak === 100) {
        await gameService.awardBadge(childId, '👑 Century Champion', 'streak');
      }
      
      return newStreak;
    }
    
    return child.streak;
  },
  
  // Save game metadata (for cloud_adventure, etc.)
  saveGameMetadata: async (childId, gameId, metadata) => {
    const key = `${childId}:${gameId}:metadata`;
    // Store in Redis or separate table
    console.log(`Saving metadata for ${childId}:${gameId}`, metadata);
    return true;
  }
};

module.exports = gameService;