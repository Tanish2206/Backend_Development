const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

exports.authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_KEY, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.userData = userData;
    next();
  });
};

exports.checkAdmin = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.role === "Admin") {
      next();
    } else {
      res.status(403).json({
        message: "Access denied. Only super admins can add projects.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to authenticate user" });
  }
};

exports.checkAdminByToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_KEY, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.userData = userData;
  });

  try {
    const { userId, role } = req.userData;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.role === "Admin") {
      next();
    } else {
      res.status(403).json({
        message: "Access denied. Only super admins can add projects.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to authenticate user" });
  }
};

exports.checkSuperAdmin = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.role === "SuperAdmin") {
      next();
    } else {
      res.status(403).json({
        message: "Access denied.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to authenticate user" });
  }
};

exports.checkSuperAdminByToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_KEY, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.userData = userData;
  });

  try {
    const { userId, role } = req.userData;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.role === "SuperAdmin") {
      next();
    } else {
      res.status(403).json({
        message: "Access denied.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to authenticate user" });
  }
};