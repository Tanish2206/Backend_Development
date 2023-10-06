const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { PrismaClient } = require("@prisma/client");
const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 1 month from now in seconds

exports.createToken = (data) => {
  // data contains userId, and role
  return jwt.sign(data, process.env.JWT_KEY, {
    expiresIn: expirationTime,
  });
};

exports.generateOTP = async (userId) => {
  const prisma = new PrismaClient();
  const code = otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const otp = await prisma.OTP.findUnique({
    where: { userId },
  });
  // If otp entry exists, update the otp code in the table
  if (otp) {
    await prisma.OTP.update({
      where: { userId },
      data: { code: parseInt(code) },
    });
  } else {
    await prisma.OTP.create({
      data: {
        code: parseInt(code),
        userId,
      },
    });
  }
  return code;
};

exports.generateDesignerOTP = async (designerId) => {
  const prisma = new PrismaClient();
  const code = otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const otp = await prisma.OTP.findUnique({
    where: { designerId },
  });
  // If otp entry exists, update the otp code in the table
  if (otp) {
    await prisma.OTP.update({
      where: { designerId },
      data: { code: parseInt(code) },
    });
  } else {
    await prisma.OTP.create({
      data: {
        code: parseInt(code),
        designerId,
      },
    });
  }
  return code;
};