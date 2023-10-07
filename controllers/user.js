const axios = require("axios");
const helper = require("../utility/loginHelper");
const nodemailer = require('nodemailer');
const prisma = require('../utility/prismaClient');

const sendOTPOnMobile = async (mobile, code) => {
    url = "https://www.fast2sms.com/dev/bulkV2";
    var data = {
      authorization: process.env.FAST2SMS_Auth_key,
      numbers: mobile,
      variables_values: code,
      method: "GET",
      route: "otp",
    };
    headers={};
    method={};
    try {
      await axios({url,params: data});
    } catch (error) {
	    console.log(error);
      return res.status(400).send({ Error: "Error while sending otp" });
    }
}

module.exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, displayPicture, mobile, role } = req.body;

    if (!['User', 'Designer'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Role must be 'User' or 'Designer'." });
    }

    let user;
    let designer;

    if (role === 'User') {
      user = await prisma.user.findUnique({
        where: { mobile: BigInt(mobile) },
      });

      if (user) {
        return res.status(400).json({ message: "User already registered" });
      }

      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          displayPicture,
          mobile: BigInt(mobile),
        },
      });

      const userId = user.id;
      const code = await helper.generateOTP(userId);
      console.log(code);
      //await sendOTPOnMobile(mobile, code);

      return res.status(200).json({
        userId: userId,
        message: "OTP sent successfully.",
        code:code,
      });
    } 
    else if (role === 'Designer') {
      const { 
        firstName,
        lastName,
        email,
        password,
        mobile,
        gender,
        address,
        country,
        city,
        state,
        dateOfBirth,
        category,
        workingHours,
        paymentCondition,
        accountName,
        accountNumber,   
        IFSC,
        website,
        about, } = req.body;

      designer = await prisma.designer.findUnique({
        where: { mobile: BigInt(mobile) },
      });

      if (designer) {
        return res.status(400).json({ message: "Designer already registered" });
      }

      designer = await prisma.designer.create({
        data: {
          role,
          firstName,
          lastName,
          email,
          password,
          gender,
          address,
          country,
          city,
          state,
          dateOfBirth,
          category,
          workingHours,
          paymentCondition,
          accountName,
          accountNumber: BigInt(accountNumber),   
          IFSC,
          website,
          about,
          mobile: BigInt(mobile),
        },
      });
    }

    const designerId = designer.id;
      const code = await helper.generateDesignerOTP(designerId);
      console.log(code);

    //await sendOTPOnMobile(mobile, code);

    return res.status(200).json({
      designerId: designerId,
      message: "OTP sent successfully.",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal Server error");
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { mobile, role } = req.body;

    if (!['User', 'Designer'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Role must be 'User' or 'Designer'." });
    }

    let user;

    if (role === 'User') {
      user = await prisma.user.findUnique({
        where: { mobile: BigInt(mobile) },
      });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      if (user.status === 0) {
        return res.status(401).json({ message: "User is inactive" });
      }

      const userId = user.id;
      const code = await helper.generateOTP(userId);
      console.log(code);
      //await sendOTPOnMobile(mobile, code);

      return res.status(200).json({
        userId: userId,
        message: "OTP sent successfully.",
      });
    } else if (role === 'Designer') {
      let designer = await prisma.designer.findUnique({
        where: { mobile: BigInt(mobile) },
      });

      if (!designer) {
        return res.status(400).json({ message: "Designer not found" });
      }

      if (designer.status === 0) {
        return res.status(401).json({ message: "Designer is inactive" });
      }

      const designerId = designer.id;
      const code = await helper.generateDesignerOTP(designerId);
      console.log(code);
      //await sendOTPOnMobile(mobile, code);

      return res.status(200).json({
        designerId: designerId,
        message: "OTP sent successfully.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server error");
  }
};

// exports.verifyOTP = async (req, res, next) => {
//   BigInt.prototype.toJSON = function () {
//     return this.toString();
//   };
//   try {
//     const { designerId, userId, code } = req.body;
//     let isDesigner = false;

//     if (designerId) {
//       isDesigner = true;
//     } else if (!userId) {
//       return res.status(400).json({ message: "Invalid request. Please provide either designerId or userId." });
//     }

//     const otp = await prisma.OTP.findUnique({
//       where: isDesigner ? { designerId: designerId } : { userId: userId },
//     });

//     if (!otp) {
//       return res.status(400).json({ Error: "OTP not found. Please request a new OTP." });
//     }

//     if (parseInt(otp.code) === parseInt(code)) {
//       let updatedEntity;

//       if (isDesigner) {
//         updatedEntity = await prisma.designer.update({
//           where: { id: designerId },
//           data: { isVerified: true },
//           include: {
//             assignedProjects: {
//               include: {
//                 media: true,
//               },
//             },
//             designerMedia: true,
//           },
//         });
//       } else {
//         updatedEntity = await prisma.user.update({
//           where: { id: userId },
//           data: { isVerified: true },
//           include: {
//             projects: {
//               select: {
//                 id: true,
//                 title: true,
//                 description: true,
//                 location: true,
//                 latitude: true,
//                 longitude: true,
//                 width: true,
//                 length: true,
//                 totalAmount: true,
//                 paidAmount: true,
//                 projectStatus: true,
//                 isPaymentDone: true,
//                 isSiteIrregular: true,
//                 isSiteVisitRequired: true,
//                 currentIteration: true,
//                 maximumIterations: true,
//                 projectType: true,
//                 clientId: true,
//                 designerId: true,
//                 media: {
//                   where: {
//                     OR: [
//                       { mediaType: 'Image' },
//                       { mediaType: 'Video' },
//                     ],
//                   },
//                   select: {
//                     link: true,
//                     mediaType: true,
//                     purpose: true,
//                   },
//                 },
//               },
//             },
//             designerMedia: {
//               where: {
//                 OR: [
//                   { mediaType: 'Image', purpose: 'ProfilePhoto' },
//                   { mediaType: 'Image', purpose: 'IDProof' },
//                   { mediaType: 'Image', purpose: 'DesignFile' },
//                 ],
//               },
//               select: {
//                 link: true,
//                 mediaType: true,
//                 purpose: true,
//               },
//             },
//           },
//         });
//       }

//       if (!updatedEntity) {
//         return res.status(400).json({ Error: "Failed to verify user/designer" });
//       }

//       const token = helper.createToken({
//         designerId: isDesigner ? designerId : undefined,
//         userId: !isDesigner ? userId : undefined,
//         role: updatedEntity.role,
//       });

//       // Add the token entry in the Users/Designers table
//       if (isDesigner) {
//         await prisma.designer.update({
//           where: { id: designerId },
//           data: { token: token },
//         });
//       } else {
//         await prisma.user.update({
//           where: { id: userId },
//           data: { token: token },
//         });
//       }

//       // Delete the OTP entry for the user/designer
//       await prisma.OTP.delete({
//         where: isDesigner ? { designerId: designerId } : { userId: userId },
//       });

//       // Format projects and media URLs
//       const formattedProjects = updatedEntity.assignedProjects ? updatedEntity.assignedProjects.map((project) => {
//         const siteImagesUrls = project.media ? project.media
//           .filter((media) => media.mediaType === 'Image')
//           .map((media) => media.link) : [];

//         const videosUrls = project.media ? project.media
//           .filter((media) => media.mediaType === 'Video')
//           .map((media) => media.link) : [];

//         return {
//           id: project.id,
//           title: project.title,
//           description: project.description,
//           location: project.location,
//           latitude: project.latitude,
//           longitude: project.longitude,
//           width: project.width,
//           length: project.length,
//           totalAmount: project.totalAmount,
//           paidAmount: project.paidAmount,
//           projectStatus: project.projectStatus,
//           isPaymentDone: project.isPaymentDone,
//           isSiteIrregular: project.isSiteIrregular,
//           isSiteVisitRequired: project.isSiteVisitRequired,
//           currentIteration: project.currentIteration,
//           maximumIterations: project.maximumIterations,
//           projectType: project.projectType,
//           clientId: project.clientId,
//           designerId: project.designerId,
//           siteImagesUrls: [...siteImagesUrls], // Convert to an array
//           videosUrls: [...videosUrls], // Convert to an array
//         };
//       }) : [];

//       // Extract designer media URLs
//       const profilePhotoUrl = updatedEntity.designerMedia
//         .filter((media) => media.mediaType === 'Image' && media.purpose === 'profilePhoto')
//         .map((media) => media.link);
//       const IDProofUrl = updatedEntity.designerMedia
//         .filter((media) => media.mediaType === 'Image' && media.purpose === 'IDProof')
//         .map((media) => media.link);
//       const designFileUrl = updatedEntity.designerMedia
//         .filter((media) => media.mediaType === 'Image' && media.purpose === 'designFile')
//         .map((media) => media.link);

//       delete updatedEntity.designerMedia;

//       delete updatedEntity.assignedProjects;

//       return res
//         .status(200)
//         .cookie("jwt", token, {
//           httpOnly: false,
//           maxAge: 3600 * 24 * 1000,
//         })
//         .json({
//           message: "OTP verified",
//           user: { ...updatedEntity, projects: formattedProjects, profilePhotoUrl, IDProofUrl, designFileUrl }, // Include user details along with the associated projects and media URLs
//           authToken: token,
//         });
//     }

//     return res.status(400).json({ Error: "Invalid OTP" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal Server error");
//   }
// };


module.exports.verifyOTP = async (req, res, next) => {
  try {
    const { designerId, userId, code } = req.body;
    let isDesigner = false;

    if (designerId) {
      isDesigner = true;
    } else if (!userId) {
      return res.status(400).json({ message: "Invalid request. Please provide either designerId or userId." });
    }

    const otp = await prisma.OTP.findUnique({
      where: isDesigner ? { designerId: designerId } : { userId: userId },
    });

    if (!otp) {
      return res.status(400).json({ Error: "OTP not found. Please request a new OTP." });
    }

    if (parseInt(otp.code) === parseInt(code)) {
      let updatedEntity;

      if (isDesigner) {
        updatedEntity = await prisma.designer.update({
          where: { id: designerId },
          data: { isVerified: true },
        });
      } else {
        updatedEntity = await prisma.user.update({
          where: { id: userId },
          data: { isVerified: true },
        });
      }

      if (!updatedEntity) {
        return res.status(400).json({ Error: "Failed to verify user/designer" });
      }

      const token = helper.createToken({
        designerId: isDesigner ? designerId : undefined,
        userId: !isDesigner ? userId : undefined,
        role: updatedEntity.role,
      });

      // Add the token entry in the Users/Designers table
      if (isDesigner) {
        await prisma.designer.update({
          where: { id: designerId },
          data: { token: token },
        });
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: { token: token },
        });
      }

      // Delete the OTP entry for the user/designer
      await prisma.OTP.delete({
        where: isDesigner ? { designerId: designerId } : { userId: userId },
      });

      // Return success response
      return res
        .status(200)
        .cookie("jwt", token, {
          httpOnly: false,
          maxAge: 3600 * 24 * 1000,
        })
        .json({
          message: "OTP verified",
          userId: updatedEntity.id,
          authToken: token,
        });
    }

    // Invalid OTP
    return res.status(400).json({ Error: "Invalid OTP" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server error");
  }
};

module.exports.getprofile = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  try {
    // const { mobile } = req.body;
    const { id } = req.query;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) return res.status(400).json({ message: "user not found" });

    if (!user.isVerified)
      return res.status(400).json({ message: "user not verified" });

    // Make sure that JWT token corresponds to the requested user
    if (req.userData.userId !== user.id) {
      return res.status(403).json({ message: "You are not authorized" });
    }
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: "Internal Server Error" });
  }
};

exports.updateUser = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  try {
    const { id } = req.query;
    const { firstName, lastName, email, displayPicture } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        email,
        displayPicture,
      },
    });

    res.json({
      message: "User Details Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

module.exports.enquiry = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  try {
    const { name, email, mobile, message } = req.body;

    // Save the inquiry to the database
    const inquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        mobile: BigInt(mobile),
        message,
      },
    });

    // Send the email
    const transporter = nodemailer.createTransport({
      // Set up your email transport configuration
      // For example, using Gmail SMTP:
      service: 'Gmail',
      auth: {
        user: 'yash.nandankar@gmail.com',
        pass: 'Y@sh2002',
      },
    });

    const mailOptions = {
      from: 'yash.nandankar@gmail.com',
      to: 'yashnandankar.daji@gmail.com', // Send the email to the user who made the inquiry
      subject: 'Thank you for your inquiry',
      text: 'Your inquiry has been received. We will get back to you shortly.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      }
    });

    res.json({ success: true, message: 'Inquiry sent and email notification sent.' });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to create inquiry.' });
  }
};
