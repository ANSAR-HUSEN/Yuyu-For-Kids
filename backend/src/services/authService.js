const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_yuyu';

const registerParent = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const parent = await prisma.parent.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  
  return parent;
};

const loginParent = async (email, password) => {
  const parent = await prisma.parent.findUnique({ where: { email } });
  if (!parent) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, parent.password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = jwt.sign({ id: parent.id }, JWT_SECRET, { expiresIn: '7d' });
  
  return { parent, token };
};

module.exports = { registerParent, loginParent };