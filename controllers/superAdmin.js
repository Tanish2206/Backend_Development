// const { PrismaClient } = require("@prisma/client");
// const fast2sms = require("fast-two-sms");
// const helper = require("../utility/loginHelper");
// const responses = require("../utility/response");
// const prisma = new PrismaClient();

// module.exports.login = async (req, res, next) => {
//   BigInt.prototype.toJSON = function () {
//     return this.toString();
//   };
//   try {
//     const { mobile, email, password } = req.body;

//     // Check if the requested email, password, and mobile match the super admin credentials
//     const isSuperAdmin = email === "admin@daji.co.in" && password === "daji@123" && mobile === "9999999999";

//     let user = await prisma.user.findUnique({
//       where: { email: "admin@daji.co.in" },
//     });

//     if (!user && isSuperAdmin) {
//       // Register the user as the super admin
//       user = await prisma.user.create({
//         data: {
//           mobile: BigInt("9999999999"),
//           email: "admin@daji.co.in",
//           password: "daji@123",
//           role: "SuperAdmin",
//         },
//       });
//     }

//     if (!user || (user.role !== "SuperAdmin" && !isSuperAdmin)) {
//       // User is not registered as super admin or does not have correct credentials
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     if (!isSuperAdmin) {
//       // Non-super admin login attempt with different email and password
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     // Generate authentication token if user is a super admin
//     const token = helper.createToken({
//       userId: user.id,
//       role: user.role,
//     });

//     // Update user with authentication token only if user is a super admin
//     if (user.role === "SuperAdmin") {
//       await prisma.user.update({
//         where: { id: user.id },
//         data: { token: token },
//       });
//     }

//     return res.status(200).json({
//       userId: user.id,
//       authToken: token,
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).send("Internal Server error");
//   }
// };

// module.exports.getprofile = async (req, res, next) => {
//   BigInt.prototype.toJSON = function () {
//     return this.toString();
//   };
//   try {
//     // const { mobile } = req.body;
//     const { id } = req.query;

//     const user = await prisma.user.findUnique({
//       where: { id: parseInt(id) },
//     });

//     if (!user) return res.status(400).json({ message: "Super admin not found" });

//     if (!user.isVerified)
//       return res.status(400).json({ message: "Super admin not verified" });

//     // Make sure that JWT token corresponds to the requested user
//     // if (req.userData.userId !== user.id) {
//     //   return res.status(403).json({ message: "You are not authorized" });
//     // }
//     return res.status(200).json(user);
//   } catch (e) {
//     console.log(e);
//     return res.status(400).send({ error: "Internal Server Error" });
//   }
// };

// exports.updateSuperAdmin = async (req, res, next) => {
//   BigInt.prototype.toJSON = function () {
//     return this.toString();
//   };
//   try {
//     const { id } = req.query;
//     const { email, password, mobile } = req.body;

//     const updateSuperdAdmin = await prisma.user.update({
//       where: { id: parseInt(id) },
//       data: {
//         email,
//         password,
//         mobile: BigInt(mobile),
//       },
//     });

//     res.json({
//       message: "Super Admin Details Updated Successfully",
//       user: updatedSuperAdmin,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update super admin" });
//   }
// };

// exports.updateAdmin = async (req, res, next) => {
//   BigInt.prototype.toJSON = function () {
//     return this.toString();
//   };
//   try {
//     const { id } = req.query;
//     const { email, password } = req.body;

//     const updatedAdmin = await prisma.user.update({
//       where: { id: parseInt(id) },
//       data: {
//         email,
//         password,
//       },
//     });

//     res.json({
//       message: "Admin Details Updated Successfully",
//       user: updatedAdmin,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update admin" });
//   }
// };

// exports.updateUser = async (req, res, next) => {
//   BigInt.prototype.toJSON = function () {
//     return this.toString();
//   };
//   try {
//     const { id } = req.query;
//     const { firstName, lastName, email, displayPicture, mobile } = req.body;

//     const updatedUser = await prisma.user.update({
//       where: { id: parseInt(id) },
//       data: {
//         firstName,
//         lastName,
//         email,
//         displayPicture,
//         mobile: BigInt(mobile),
//       },
//     });

//     res.json({
//       message: "User Details Updated Successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update user" });
//   }
// };

// exports.updateUserStatus = async (req, res, next) => {
//   const { id, status } = req.query;
//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id: parseInt(id) },
//       data: { status: parseInt(status) }, // Update the user's status based on the input
//     });

//     if (updatedUser) {
//       res.status(200).json({ message: "User status updated successfully" });
//     } else {
//       res.status(404).json({ error: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error updating user status:", error);
//     res.status(500).json({ error: "Failed to update user status" });
//   }
// };

// module.exports.getUserDetails = async (req, res, next) => {
//   BigInt.prototype.toJSON = function () {
//     return this.toString();
//   };
//   try {
//     const users = await prisma.user.findMany({
//       where: {
//         role: "User", // Filter users by userType
//       },
//       include: {
//         projects: true, // Include the associated projects
//       },
//     });

//     const userDetails = users.map(user => {
//       const projectCount = user.projects.length;
//       const status = user.status ? 1 : 0; // Determine user status based on the "status" field
//       return { user, projectCount, status };
//     });

//     return res.status(200).json({ userDetails });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
