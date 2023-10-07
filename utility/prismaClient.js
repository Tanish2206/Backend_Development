// prismaClient.js
const { PrismaClient } = require('@prisma/client');

// Create an instance of Prisma client
const prisma = new PrismaClient();

// Export the Prisma client instance
module.exports = prisma;