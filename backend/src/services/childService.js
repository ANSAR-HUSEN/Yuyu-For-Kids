const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createChild = async (parentId, childData) => {
  const childrenCount = await prisma.child.count({
    where: { parentId: parentId }
  });
  
  if (childrenCount >= 3) {
    throw new Error('Maximum 3 children allowed per account');
  }
  
  return await prisma.child.create({
    data: {
      name: childData.name,
      age: parseInt(childData.age),
      avatar: childData.avatar || 'Baby',
      parentId: parentId,
      gamesPlayed: 0,
      storiesRead: 0,
      badgesEarned: 0,
      streak: 0,
      totalPoints: 0,
      progress: {
        create: [
          { skillType: 'Reading', level: 1, exp: 0 },
          { skillType: 'Math', level: 1, exp: 0 },
          { skillType: 'Logic', level: 1, exp: 0 }
        ]
      }
    }
  });
};

const getChildrenByParent = async (parentId) => {
  return await prisma.child.findMany({
    where: { parentId },
    include: {
      progress: true,
      rewards: true
    }
  });
};

const updateChild = async (childId, childData, parentId) => {
  const child = await prisma.child.findFirst({
    where: { id: childId, parentId }
  });
  
  if (!child) throw new Error('Child not found');
  
  return await prisma.child.update({
    where: { id: childId },
    data: {
      name: childData.name,
      age: parseInt(childData.age),
      avatar: childData.avatar || child.avatar
    }
  });
};

const updateChildStats = async (childId, stats, parentId) => {
  const child = await prisma.child.findFirst({
    where: { id: childId, parentId }
  });
  
  if (!child) throw new Error('Child not found');
  
  return await prisma.child.update({
    where: { id: childId },
    data: {
      gamesPlayed: stats.gamesPlayed !== undefined ? stats.gamesPlayed : undefined,
      storiesRead: stats.storiesRead !== undefined ? stats.storiesRead : undefined,
      badgesEarned: stats.badgesEarned !== undefined ? stats.badgesEarned : undefined,
      totalPoints: stats.totalPoints !== undefined ? stats.totalPoints : undefined,
      streak: stats.streak !== undefined ? stats.streak : undefined,
      lastActive: stats.lastActive !== undefined ? stats.lastActive : new Date()
    }
  });
};

const incrementGamesPlayed = async (childId, parentId) => {
  const child = await prisma.child.findFirst({
    where: { id: childId, parentId }
  });
  
  if (!child) throw new Error('Child not found');
  
  return await prisma.child.update({
    where: { id: childId },
    data: {
      gamesPlayed: { increment: 1 }
    }
  });
};

const deleteChild = async (childId, parentId) => {
  const child = await prisma.child.findFirst({
    where: { id: childId, parentId }
  });
  
  if (!child) throw new Error('Child not found');
  
  await prisma.$transaction([
    prisma.progress.deleteMany({ where: { childId: childId } }),
    prisma.reward.deleteMany({ where: { childId: childId } }),
    prisma.chatLog.deleteMany({ where: { childId: childId } }),
    prisma.child.delete({ where: { id: childId } })
  ]);
  
  return { message: 'Child deleted successfully' };
};

module.exports = { 
  createChild, 
  getChildrenByParent, 
  updateChild, 
  updateChildStats,
  incrementGamesPlayed,
  deleteChild 
};