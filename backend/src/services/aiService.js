const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Set to true later when you have an API key
const USE_REAL_AI = false;

const generateStory = async (childId, topic) => {
  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) throw new Error("Child not found");

  let storyContent = "";

  if (USE_REAL_AI) {
    storyContent = "Real OpenAI logic goes here...";
  } else {
    // Mock Logic
    const storyBank = [
      `Once, a brave ${topic} found a glowing map that led to a mountain made of marshmallows!`,
      `In a secret garden, ${topic} discovered that they could talk to butterflies using a magic whistle.`,
      `The fastest ${topic} in the world decided to enter a race against a shooting star.`
    ];
    storyContent = storyBank[Math.floor(Math.random() * storyBank.length)];
  }

  // Save the story to the database
  return await prisma.chatLog.create({
    data: {
      childId,
      role: "assistant",
      content: storyContent
    }
  });
};

// NEW: Function to get the child's story history
const getStoryHistory = async (childId) => {
  return await prisma.chatLog.findMany({
    where: { childId, role: "assistant" },
    orderBy: { createdAt: 'desc' }
  });
};

module.exports = { generateStory, getStoryHistory };