const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function verifyPassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// ✅ Updated Authentication Middleware
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token;

    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Unauthorized or invalid token' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

module.exports = {
  prisma,
  hashPassword,
  verifyPassword,
  signToken,
  authenticate,
  authorize,
};




// // utils/auth.js
// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const prisma = new PrismaClient();

// function hashPassword(password) {
//   return bcrypt.hash(password, 10);
// }

// function verifyPassword(password, hashed) {
//   return bcrypt.compare(password, hashed);
// }

// function signToken(payload) {
//   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
// }

// // Middleware to authenticate requests
// async function authenticate(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ error: 'No token provided' });

//   const token = authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Invalid token' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // attach user info to request
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// }

// // Middleware to authorize roles
// function authorize(...roles) {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
//     }
//     next();
//   };
// }

// module.exports = {
//   prisma,
//   hashPassword,
//   verifyPassword,
//   signToken,
//   authenticate,
//   authorize,
// };
