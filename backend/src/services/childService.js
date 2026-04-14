const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createChild = async (parentId, childData) => {
  return await prisma.child.create({
    data: {
      name: childData.name,
      age: parseInt(childData.age),
      avatar: childData.avatar || 'default_avatar.png',
      parentId: parentId,
      // Initialize progress for the child automatically
      progress: {
        create: [
          { skillType: 'Math' },
          { skillType: 'Logic' },
          { skillType: 'Language' }
        ]
      }
    }
  });
};

const getChildrenByParent = async (parentId) => {
  return await prisma.child.findMany({
    where: { parentId }
  });
};

module.exports = { createChild, getChildrenByParent };