const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_yuyu';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  },
});

const getPasswordResetEmailTemplate = (resetUrl, userName = '') => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Yuyu AI - Password Reset</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #f8fafc 0%, #fce7f3 100%);
        }
        
        .container {
          max-width: 560px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        .card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        
        .header {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
          padding: 40px 32px;
          text-align: center;
          border-bottom: 1px solid #f9a8d4;
        }
        
        .header h2 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.5px;
        }
        
        .header p {
          font-size: 14px;
          color: #64748b;
          margin: 8px 0 0 0;
        }
        
        .content {
          padding: 40px 32px;
        }
        
        h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
        }
        
        .subtitle {
          font-size: 16px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 32px;
        }
        
        .greeting {
          font-size: 16px;
          color: #334155;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        
        .button-container {
          text-align: center;
          margin: 32px 0;
        }
        
        .button {
          display: inline-block;
          background: #ec4899;
          color: white !important;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
        }
        
        .button:hover {
          background: #db2777;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(236, 72, 153, 0.4);
        }
        
        .info-box {
          background: linear-gradient(135deg, #fef2f2 0%, #fff5f5 100%);
          border: 2px solid #fecdd3;
          border-radius: 16px;
          padding: 20px 24px;
          margin: 24px 0;
          position: relative;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.08);
        }
        
        .info-box::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #ec4899, #f43f5e, #ec4899);
          border-radius: 18px;
          z-index: -1;
          opacity: 0.3;
        }
        
        .info-text {
          font-size: 14px;
          color: #1e293b;
          line-height: 1.6;
          margin: 0;
          text-align: center;
        }
        
        .info-text strong {
          color: #ec4899;
          font-size: 15px;
          display: block;
          margin-bottom: 8px;
        }
        
        .divider {
          height: 2px;
          background: linear-gradient(to right, #e2e8f0, #f9a8d4, #e2e8f0);
          margin: 32px 0 24px 0;
        }
        
        .footer {
          text-align: center;
          padding: 24px 32px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
          font-size: 12px;
          color: #94a3b8;
          margin: 0 0 8px 0;
          line-height: 1.5;
        }
        
        .footer-link {
          color: #ec4899;
          text-decoration: none;
          font-size: 12px;
        }
        
        .footer-link:hover {
          text-decoration: underline;
        }
        
        .warning-text {
          font-size: 13px;
          color: #475569;
          margin-top: 24px;
          padding: 14px;
          background: #f8fafc;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        
        @media (max-width: 600px) {
          .container {
            padding: 20px 16px;
          }
          .content {
            padding: 32px 20px;
          }
          h1 {
            font-size: 24px;
          }
          .button {
            padding: 12px 28px;
            font-size: 14px;
          }
          .info-box {
            padding: 16px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <h2>Yuyu AI</h2>
            <p>A Safe Learning Universe for your children</p>
          </div>
          
          <div class="content">
            <h1>Reset Your Password</h1>
            <p class="subtitle">We received a request to reset your password</p>
            
            ${userName ? `<p class="greeting">Hello <strong>${userName}</strong>,</p>` : '<p class="greeting">Hello,</p>'}
            
            <p class="greeting">We received a request to reset the password for your Yuyu AI account. Click the button below to create a new password:</p>
            
            <div class="button-container">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="info-box">
              <p class="info-text">
                <strong>This link will expire in 1 hour</strong>
                For your security, the password reset link is only valid for 60 minutes.
              </p>
            </div>
            
            <div class="warning-text">
              If you did not request this, please ignore this email. Your password will not change until you create a new one.
            </div>
            
            <div class="divider"></div>
            
            <p class="info-text" style="text-align: center; font-size: 14px; color: #64748b;">
              Having trouble? Copy and paste this link into your browser:
            </p>
            <p style="text-align: center; font-size: 12px; color: #94a3b8; word-break: break-all; background: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 8px;">
              ${resetUrl}
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              <strong>Yuyu AI</strong> - A Safe Learning Universe for Families
            </p>
            <p class="footer-text">
              This is an automated message, please do not reply to this email.
            </p>
            <a href="#" class="footer-link">Contact Support</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// REGISTER - with duplicate email handling
const registerParent = async (email, password, name = null) => {
  // Validate required fields
  if (!email) {
    throw new Error('Email is required');
  }
  if (!password) {
    throw new Error('Password is required');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // Check if user already exists
  const existingParent = await prisma.parent.findUnique({
    where: { email }
  });
  
  if (existingParent) {
    throw new Error('Email already registered. Please log in instead.');
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const parent = await prisma.parent.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
    },
  });
  
  return parent;
};

// LOGIN - with invalid credentials handling
const loginParent = async (email, password) => {
  const parent = await prisma.parent.findUnique({ where: { email } });
  if (!parent) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, parent.password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = jwt.sign({ id: parent.id }, JWT_SECRET, { expiresIn: '7d' });
  
  return { 
    parent: {
      id: parent.id,
      email: parent.email,  
      name: parent.name || ""
    }, 
    token 
  };
};

// FORGOT PASSWORD - with email not found handling
const forgotPassword = async (email) => {
  if (!email) {
    throw new Error('Email is required');
  }
  
  const parent = await prisma.parent.findUnique({ where: { email } });
  
  // For security, don't reveal if email exists or not
  if (!parent) {
    throw new Error('If an account exists with this email, you will receive a reset link');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  await prisma.parent.update({
    where: { email },
    data: {
      resetToken: resetTokenHash,
      resetTokenExpiry: new Date(Date.now() + 3600000),
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  
  try {
    await transporter.sendMail({
      from: '"Yuyu AI" <noreply@yuyu.com>',
      to: email,
      subject: 'Yuyu AI - Password Reset Request',
      html: getPasswordResetEmailTemplate(resetUrl, parent.name),
    });
    
    return { message: 'If an account exists with this email, you will receive a reset link' };
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    throw new Error('Failed to send reset email. Please try again later.');
  }
};

// RESET PASSWORD - with token validation
const resetPassword = async (token, newPassword) => {
  if (!token) {
    throw new Error('Reset token is required');
  }
  
  if (!newPassword) {
    throw new Error('New password is required');
  }
  
  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const parent = await prisma.parent.findFirst({
    where: {
      resetToken: resetTokenHash,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!parent) {
    throw new Error('Invalid or expired reset token. Please request a new password reset.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.parent.update({
    where: { id: parent.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return { message: 'Password reset successfully. Please log in with your new password.' };
};
const getParentProfile = async (parentId) => {
  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    }
  });
  
  if (!parent) throw new Error('Parent not found');
  return parent;
};
const updateParentProfile = async (parentId, name) => {
  const updatedParent = await prisma.parent.update({
    where: { id: parentId },
    data: { name },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });
  
  return updatedParent;
};
module.exports = { registerParent, loginParent, forgotPassword, resetPassword, getParentProfile, updateParentProfile };