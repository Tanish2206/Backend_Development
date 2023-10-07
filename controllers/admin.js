const { PrismaClient } = require("@prisma/client");
const helper = require("../utility/loginHelper");
const responses = require("../utility/response");
const {uploadMedia} = require('../utility/AWSUtils');
const prisma = require('../utility/prismaClient');

// module.exports.login = async (req, res, next) => {
//   BigInt.prototype.toJSON = function () {
//     return this.toString();
//   };
//   try {
//     const { mobile, email, password } = req.body;
//     let user = await prisma.user.findUnique({
//       where: { email: String(email) },
//     });

//     if (!user) {
//       // User is not registered, so register them
//       user = await prisma.user.create({
//         data: {
//           mobile: BigInt(mobile),
//           email,
//           password,
//           role: "Admin",
//         },
//       });
//     }

//     // Generate authentication token
//     const token = helper.createToken({
//       userId: user.id,
//       role: user.role,
//     });

//     // Update user with authentication token
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { token: token },
//     });

//     return res.status(200).json({
//       userId: user.id,
//       authToken: token,
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).send("Internal Server error");
//   }
// };

module.exports.login = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  try {
    const { mobile, email, password } = req.body;
  
    // Check if the requested email, password, and mobile match the super admin credentials
    const isAdmin = email === "admin@daji.co.in" && password === "daji@123" && mobile === "9999999999";

    let user = await prisma.user.findUnique({
      where: { email: "admin@daji.co.in" },
    });

    if (!user && isAdmin) {
      // Register the user as the super admin
      user = await prisma.user.create({
        data: {
          mobile: BigInt("9999999999"),
          email: "admin@daji.co.in",
          password: "daji@123",
          role: "Admin",
        },
      });
    }

    if (!user || (user.role !== "Admin" && !isAdmin)) {
      // User is not registered as super admin or does not have correct credentials
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!isAdmin) {
      // Non-super admin login attempt with different email and password
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Generate authentication token if user is a super admin
    const token = helper.createToken({
      userId: user.id,
      role: user.role,
    });

    // Update user with authentication token only if user is a super admin
    if (user.role === "Admin") {
      await prisma.user.update({
        where: { id: user.id },
        data: { token: token },
      });
    }

    return res.status(200).json({
      userId: user.id,
      authToken: token,
    });
  } catch (e) {
    console.log(e);
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

    // if (!admin) return res.status(400).json({ message: "admin not found" });

    // if (!admin.isVerified)
    //   return res.status(400).json({ message: "admin not verified" });

    // Make sure that JWT token corresponds to the requested user
    // if (req.userData.userId !== user.id) {
    //   return res.status(403).json({ message: "You are not authorized" });
    // }
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: "Internal Server Error" });
  }
};

exports.updateAdmin = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  try {
    const { id } = req.query;
    const { email, password } = req.body;

    const updatedAdmin = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        email,
        password,
      },
    });

    res.json({
      message: "Admin Details Updated Successfully",
      user: updatedAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update admin" });
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, displayPicture, mobile } = req.body;

    // Check if the user already exists by mobile number
    let user = await prisma.user.findUnique({
      where: { mobile: BigInt(mobile) },
    });

    // Check if the user already exists by email
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email },
      });
    }

    if (user) {
      // User with the same mobile or email already exists
      return res.status(400).json({ message: "User with the same mobile or email already registered" });
    }

    // Create the new user
    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        displayPicture,
        mobile: BigInt(mobile),
      },
    });

    return res.status(200).json({ message: "User registered successfully", user });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal Server error");
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

exports.updateUserStatus = async (req, res, next) => {
  const { id, status } = req.query;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { status: parseInt(status) }, // Update the user's status based on the input
    });

    if (updatedUser) {
      res.status(200).json({ message: "User status updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Failed to update user status" });
  }
};

module.exports.getUserDetails = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  const { id } = req.query;

  try {
    let whereCondition = {
      role: "User", // Filter users by userType
    };

    if (id) {
      whereCondition = {
        ...whereCondition,
        id: parseInt(id),
      };
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      include: {
        projects: {
          include: {
            media: true // Include the associated media (siteImages and videos)
          }
        }
      },
    });

    const userDetails = users.map(user => {
      const projectCount = user.projects.length;
      const status = user.status ? 1 : 0; // Determine user status based on the "status" field

      const projects = user.projects.map(project => {
        const uniqueSiteImagesUrls = [...new Set(
          project.media
            .filter(mediaItem => mediaItem.mediaType === 'Image')
            .map(mediaItem => mediaItem.link)
        )];

        const uniqueVideosUrls = [...new Set(
          project.media
            .filter(mediaItem => mediaItem.mediaType === 'Video')
            .map(mediaItem => mediaItem.link)
        )];

        return {
          id: project.id,
          title: project.title,
          description: project.description,
          location: project.location,
          clientId: project.clientId,
          projectType: project.projectType,
          latitude: project.latitude,
          longitude: project.longitude,
          width: project.width,
          length: project.length,
          progress: project.progress,
          totalAmount: project.totalAmount,
          paidAmount: project.paidAmount,
          isPaymentDone: project.isPaymentDone,
          currentIteration: project.currentIteration,
          maximumIterations: project.maximumIterations,
          projectStatus: project.projectStatus,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          comment: project.comment,
          dueDate: project.dueDate,
          paymentDueDate: project.paymentDueDate,
          siteImagesUrls: uniqueSiteImagesUrls,
          videosUrls: uniqueVideosUrls
        };
      });

      return { user, projectCount, status, projects };
    });

    const reversedResponseData = userDetails.reverse();

    // Extract only the required fields from the projects
    const formattedResponseData = reversedResponseData.map(item => ({
      user: {
        id: item.user.id,
        firstName: item.user.firstName,
        lastName: item.user.lastName,
        mobile: item.user.mobile,
        token: item.user.token,
        displayPicture: item.user.displayPicture,
        password: item.user.password,
        isVerified: item.user.isVerified,
        email: item.user.email,
      },
      projectCount: item.projectCount,
      status: item.status,
      projects: item.projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        location: project.location,
        clientId: project.clientId,
        projectType: project.projectType,
        latitude: project.latitude,
        longitude: project.longitude,
        width: project.width,
        length: project.length,
        progress: project.progress,
        totalAmount: project.totalAmount,
        paidAmount: project.paidAmount,
        isPaymentDone: project.isPaymentDone,
        currentIteration: project.currentIteration,
        maximumIterations: project.maximumIterations,
        projectStatus: project.projectStatus,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        comment: project.comment,
        dueDate: project.dueDate,
        paymentDueDate: project.paymentDueDate,
        siteImagesUrls: project.siteImagesUrls,
        videosUrls: project.videosUrls
      }))
    }));

    return res.status(200).json({ userDetails: formattedResponseData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addBanner = async (req, res, next) => {
  try {
    const {
      id,
      description,
    } = req.body;

    const folder = 'Banners/';
    const siteImages = Array.isArray(req.files?.siteImagesUrls) ? req.files.siteImagesUrls : [req.files.siteImagesUrls];

    // Upload siteImages to S3 and handle the uploaded media
    let siteImagesUrls = [];
    if (siteImages.length > 0) {
      siteImagesUrls = await Promise.all(siteImages.map((file) => uploadMedia(file, folder)));
    }

    const media = siteImagesUrls.map((url) => ({ link: url, mediaType: 'Image' }));

    const bannerData = await prisma.banner.create({
      data: {
        bannerMedia: {
          create: media,
        },
        description,
      },
      include: {
        bannerMedia: true,
      },
    });

    const response = {
      success: true,
      siteImagesUrls,
      description: bannerData.description,
      id: bannerData.id,
    };

    res.status(200).json({
      ...response,
      siteImagesUrls: response.siteImagesUrls,
    });
  } catch (err) {
    // Handle any errors that occur during the upload process
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addPopularDesigns = async (req, res, next) => {
  try {
    const {
      id,
      description,
    } = req.body;

    const folder = 'PopularDesigns/';
    const siteImages = Array.isArray(req.files?.siteImagesUrls) ? req.files.siteImagesUrls : [req.files.siteImagesUrls];

    // Upload siteImages to S3 and handle the uploaded media
    let siteImagesUrls = [];
    if (siteImages.length > 0) {
      siteImagesUrls = await Promise.all(siteImages.map((file) => uploadMedia(file, folder)));
    }

    const media = siteImagesUrls.map((url) => ({ link: url, mediaType: 'Image' }));

    const popularDesignData = await prisma.popularDesign.create({
      data: {
        popularDesignMedia: {
          create: media,
        },
        description,
      },
      include: {
        popularDesignMedia: true,
      },
    });

    const response = {
      success: true,
      siteImagesUrls,
      description: popularDesignData.description,
      id: popularDesignData.id,
    };

    res.status(200).json({
      ...response,
      siteImagesUrls: response.siteImagesUrls, // Rename the key to siteImagesUrls
    });
  } catch (err) {
    // Handle any errors that occur during the upload process
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getEnquiries = async (req, res, next) => {
  try {
      // Retrieve all the enquiries from the database
      const enquiries = await prisma.enquiry.findMany();

      res.json({ success: true, enquiries });
  } catch (error) {
      console.error('Error retrieving enquiries:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve enquiries.' });
  }
};

exports.assignProjectToDesigner = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  try {
    const { projectId, designerId, comment, dueDate, paymentDueDate } = req.body;

    const project = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: { 
        designerId,
        comment,
        dueDate,
        paymentDueDate,
      },
      include: {
        media: true, // Include the media data for the project
      },
    });

    const designer = await prisma.designer.update({
      where: { id: parseInt(designerId) },
      data: { 
        assignedProjects: { connect: { id: parseInt(projectId) } } },
      include: {
        designerMedia: true, // Include the media data for the designer
      },
    });

    // Extract media URLs for the assigned project
    const siteImagesUrls = project.media
      .filter((media) => media.mediaType === 'Image')
      .map((media) => media.link);
    const videosUrls = project.media
      .filter((media) => media.mediaType === 'Video')
      .map((media) => media.link);

    // Extract media URLs for the designer
    const profilePhotoUrls = designer.designerMedia
      .filter((media) => media.mediaType === 'Image' && media.purpose === 'profilePhoto')
      .map((media) => media.link);
    const IDProofUrls = designer.designerMedia
      .filter((media) => media.mediaType === 'Image' && media.purpose === 'IDProof')
      .map((media) => media.link);

    res.status(200).json({
      message: "Project assigned to designer successfully",
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        location: project.location,
        latitude: project.latitude,
        longitude: project.longitude,
        width: project.width,
        length: project.length,
        totalAmount: project.totalAmount,
        paidAmount: project.paidAmount,
        projectStatus: project.projectStatus,
        isPaymentDone: project.isPaymentDone,
        isSiteIrregular: project.isSiteIrregular,
        isSiteVisitRequired: project.isSiteVisitRequired,
        currentIteration: project.currentIteration,
        maximumIterations: project.maximumIterations,
        projectType: project.projectType,
        clientId: project.clientId,
        designerId: project.designerId,
        comment: project.comment,
        dueDate: project.dueDate,
        paymentDueDate: project.paymentDueDate,
        siteImagesUrls,
        videosUrls,
      },
      designer: {
        id: designer.id,
        firstName: designer.firstName,
        lastName: designer.lastName,
        city: designer.city,
        state: designer.state,
        category: designer.category,
        workingHours: designer.workingHours,
        paymentCondition: designer.paymentCondition,
        accountName: designer.accountName,
        IFSC: designer.IFSC,
        website: designer.website,
        about: designer.about,
        address: designer.address,
        dateOfBirth: designer.dateOfBirth,
        gender: designer.gender,
        mobile: designer.mobile,
        token: designer.token,
        country: designer.country,
        password: designer.password,
        isVerified: designer.isVerified,
        email: designer.email,
        profilePhotoUrls,
        IDProofUrls,
      },
    });
  } catch (error) {
    console.error("Error assigning project to designer:", error);
    res.status(500).json({ error: "Failed to assign project to designer" });
  }
};

exports.updateDesignerStatus = async (req, res, next) => {
  const { id, status } = req.query;
  try {
    const updatedDesigner = await prisma.designer.update({
      where: { id: parseInt(id) },
      data: { status: parseInt(status) },
    });

    if (updatedDesigner) {
      res.status(200).json({ message: "Designer status updated successfully" });
    } else {
      res.status(404).json({ error: "Designer not found" });
    }
  } catch (error) {
    console.error("Error updating Designer status:", error);
    res.status(500).json({ error: "Failed to update Designer status" });
  }
};

module.exports.getDesignerDetails = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  const { id } = req.query;

  try {
    let whereCondition = {
      role: "Designer", // Filter users by userType
    };

    if (id) {
      whereCondition = {
        ...whereCondition,
        id: parseInt(id),
      };
    }

    const designers = await prisma.designer.findMany({
      where: whereCondition,
      include: {
        assignedProjects: {
          include: {
            media: true // Include the associated media (siteImages and videos)
          }
        },
        designerMedia: true
      },
    });

    const designerDetails = designers.map(designer => {
      const projectCount = designer.assignedProjects.length;
      const status = designer.status ? 1 : 0; // Determine user status based on the "status" field
      
      const assignedProjects = designer.assignedProjects.map(project => {
        const siteImagesUrls = [...new Set(
          project.media
            .filter(mediaItem => mediaItem.mediaType === 'Image')
            .map(mediaItem => mediaItem.link)
        )];

        const videosUrls = [...new Set(
          project.media
            .filter(mediaItem => mediaItem.mediaType === 'Video')
            .map(mediaItem => mediaItem.link)
        )];

        return {
          id: project.id,
          title: project.title,
          description: project.description,
          location: project.location,
          clientId: project.clientId,
          projectType: project.projectType,
          latitude: project.latitude,
          longitude: project.longitude,
          width: project.width,
          length: project.length,
          progress: project.progress,
          totalAmount: project.totalAmount,
          paidAmount: project.paidAmount,
          isPaymentDone: project.isPaymentDone,
          currentIteration: project.currentIteration,
          maximumIterations: project.maximumIterations,
          projectStatus: project.projectStatus,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          comment: project.comment,
          dueDate: project.dueDate,
          paymentDueDate: project.paymentDueDate,
          siteImagesUrls,
          videosUrls
        };
      });

      const profilePhotoUrl = [...new Set(
        designer.designerMedia
          .filter(mediaItem => mediaItem.mediaType === 'Image' && mediaItem.purpose === 'profilePhoto')
          .map(mediaItem => mediaItem.link)
      )];

      const IDProofUrl = [...new Set(
        designer.designerMedia
          .filter(mediaItem => mediaItem.mediaType === 'Image' && mediaItem.purpose === 'IDProof')
          .map(mediaItem => mediaItem.link)
      )];

      const designFileUrl = [...new Set(
        designer.designerMedia
          .filter(media => media.mediaType === 'Image' && media.purpose === 'designFile')
          .map(media => media.link)
      )];

      return { designer, projectCount, status, assignedProjects, profilePhotoUrl, IDProofUrl, designFileUrl };
    });

    const reversedResponseData = designerDetails.reverse();

    // Extract only the required fields from the projects
    const formattedResponseData = reversedResponseData.map(item => ({
      designer: {
        id: item.designer.id,
        firstName: item.designer.firstName,
        lastName: item.designer.lastName,
        city: item.designer.city,
        state: item.designer.state,
        category: item.designer.category,
        workingHours: item.designer.workingHours,
        paymentCondition: item.designer.paymentCondition,
        accountName: item.designer.accountName,
        IFSC: item.designer.IFSC,
        website: item.designer.website,
        about: item.designer.about,
        address: item.designer.address,
        dateOfBirth: item.designer.dateOfBirth,
        gender: item.designer.gender,
        mobile: item.designer.mobile,
        token: item.designer.token,
        country: item.designer.country,
        password: item.designer.password,
        isVerified: item.designer.isVerified,
        email: item.designer.email,
        profilePhotoUrl: item.profilePhotoUrl,
        IDProofUrl: item.IDProofUrl,
        designFileUrl: item.designFileUrl
      },
      projectCount: item.projectCount,
      status: item.status,
      assignedProjects: item.assignedProjects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        location: project.location,
        clientId: project.clientId,
        projectType: project.projectType,
        latitude: project.latitude,
        longitude: project.longitude,
        width: project.width,
        length: project.length,
        progress: project.progress,
        totalAmount: project.totalAmount,
        paidAmount: project.paidAmount,
        isPaymentDone: project.isPaymentDone,
        currentIteration: project.currentIteration,
        maximumIterations: project.maximumIterations,
        projectStatus: project.projectStatus,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        comment: project.comment,
        dueDate: project.dueDate,
        paymentDueDate: project.paymentDueDate,
        siteImagesUrls: project.siteImagesUrls,
        videosUrls: project.videosUrls
      })),
    }));

    return res.status(200).json({ designerDetails: formattedResponseData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getDesignerIdFromResponse = (designerResponse) => {
  return designerResponse.id; // Assuming the project ID is available as 'id' in the response.
};

module.exports.registerDesigner = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  try {
    const {
      role,
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
      about,
    } = req.body;

    const profilePhoto = Array.isArray(req.files?.profilePhotoUrl)
      ? req.files.profilePhotoUrl
      : req.files?.profilePhotoUrl
      ? [req.files.profilePhotoUrl]
      : [];

    const IDProof = Array.isArray(req.files?.IDProofUrl)
      ? req.files.IDProofUrl
      : req.files?.IDProofUrl
      ? [req.files.IDProofUrl]
      : [];
    
    const designFile = Array.isArray(req.files?.designFileUrl)
    ? req.files.designFileUrl
    : req.files?.designFileUrl
    ? [req.files.designFileUrl]
    : [];

    const media = [];

    const designer = await prisma.designer.create({
      data: {
        role,
        firstName,
        lastName,
        email,
        password,
        mobile: BigInt(mobile),
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
        designerMedia: {
          create: media, // Create designerMedia with the media array after it's populated
        },
      },
      include: {
        designerMedia: true,
      },
    });

    const designerId = getDesignerIdFromResponse(designer);
    const folder = `Designers/Designer ${designerId}/`;

    // Move this part here to ensure media array is populated
    let profilePhotoUrl = [];
    if (profilePhoto?.length > 0) {
      profilePhotoUrl = await Promise.all(profilePhoto.map((file) => uploadMedia(file, folder)));
      profilePhotoUrl.forEach((url) => {
        media.push({ link: url, mediaType: 'Image', purpose: 'profilePhoto' });
      });
    }

    let IDProofUrl = [];
    if (IDProof?.length > 0) {
      IDProofUrl = await Promise.all(IDProof.map((file) => uploadMedia(file, folder)));
      IDProofUrl.forEach((url) => {
        media.push({ link: url, mediaType: 'Image', purpose: 'IDProof' });
      });
    }

    let designFileUrl = [];
    if (designFile?.length > 0) {
      designFileUrl = await Promise.all(designFile.map((file) => uploadMedia(file, folder)));
      designFileUrl.forEach((url) => {
        media.push({ link: url, mediaType: 'Image', purpose: 'designFile' });
      });
    }

    // const designerId = getDesignerIdFromResponse(designer);
    // const folder = `Designers/Designer ${designerId}/`;

    const createdMedia = await prisma.designerMedia.createMany({
      data: media.map((item) => ({
        designerId: designer.id,
        ...item,
      })),
    });

    // const code = await helper.generateDesignerOTP(designerId);
    // console.log(code);

    //await sendOTPOnMobile(mobile, code);

    return res.status(200).json({
      userId: designerId,
      message: "Designer created successfully",
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateDesigner = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  try {
  const { id } = req.query;
  const {
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
    accountNumber,   
    IFSC,
    website,
    about,
    customerRating,
    totalEarnings, 
  } = req.body;

  const accountNumberCount = isNaN(parseInt(accountNumber)) ? null : parseInt(accountNumber);
  const customerRatingCount = isNaN(parseFloat(customerRating)) ? null : parseFloat(customerRating);
  const totalEarningsCount = isNaN(parseInt(totalEarnings)) ? null : parseInt(totalEarnings);

  const existingDesigner = await prisma.designer.findUnique({
    where: { id: parseInt(id) },
    include: { designerMedia: true },
  });

  if (!existingDesigner) {
    throw new Error('Designer not found.');
  }

  const media = [];

  if (req.files) {
    const profilePhoto = Array.isArray(req.files.profilePhotoUrl) ? req.files.profilePhotoUrl : req.files.profilePhotoUrl ? [req.files.profilePhotoUrl] : [];
    const IDProof = Array.isArray(req.files.IDProofUrl) ? req.files.IDProofUrl : req.files.IDProofUrl ? [req.files.IDProofUrl] : [];
    const designFile = Array.isArray(req.files?.designFileUrl)
    ? req.files.designFileUrl
    : req.files?.designFileUrl
    ? [req.files.designFileUrl]
    : [];

    // Check if new siteImages are uploaded, otherwise retain the existing ones
    if ( profilePhoto.length > 0) {
      const designerId = getDesignerIdFromResponse(existingDesigner);
      const folder = `Designers/Designer ${designerId}/`;
      const profilePhotoUrl = await Promise.all( profilePhoto.map((file) => uploadMedia(file, folder)));

      // Delete the existing siteImages if new URLs are provided
      if (existingDesigner.designerMedia.filter(mediaItem => mediaItem.mediaType === 'Image'&& mediaItem.purpose === 'profilePhoto').length > 0) {
        const deleteMediaIds = existingDesigner.designerMedia.filter(mediaItem => mediaItem.mediaType === 'Image'&& mediaItem.purpose === 'profilePhoto').map(mediaItem => mediaItem.id);
        await prisma.designerMedia.deleteMany({ where: { id: { in: deleteMediaIds } } });
      }

      profilePhotoUrl.forEach((url, index) => {
        media.push({ link: url, mediaType: 'Image', purpose: 'profilePhoto' });
        req.body[`profilePhoto[${index}]`] = url;
      });
    } else {
      // Retain existing siteImages if no new URLs are provided
      media.push(...existingDesigner.designerMedia.filter(mediaItem => mediaItem.mediaType === 'Image' && mediaItem.purpose === 'profilePhoto'));
    }

    // Check if new videos are uploaded, otherwise retain the existing ones
    if (IDProof.length > 0) {
      const designerId = getDesignerIdFromResponse(existingDesigner);
      const folder = `Designers/Designer ${designerId}/`;
      const IDProofUrl = await Promise.all(IDProof.map((file) => uploadMedia(file, folder)));

      // Delete the existing videos if new URLs are provided
      if (existingDesigner.designerMedia.filter(mediaItem => mediaItem.mediaType === 'Image'&& mediaItem.purpose === 'IDProof').length > 0) {
        const deleteMediaIds = existingDesigner.designerMedia.filter(mediaItem => mediaItem.mediaType === 'Image'&& mediaItem.purpose === 'IDProof').map(mediaItem => mediaItem.id);
        await prisma.designerMedia.deleteMany({ where: { id: { in: deleteMediaIds } } });
      }

      IDProofUrl.forEach((url, index) => {
        media.push({ link: url, mediaType: 'Image', purpose: 'IDProof' });
        req.body[`IDProof[${index}]`] = url;
      });
    }
    else {
      // Retain existing videos if no new URLs are provided
      media.push(...existingDesigner.designerMedia.filter(mediaItem => mediaItem.mediaType === 'Image'&& mediaItem.purpose === 'IDProof'));
    }

    if (designFile.length > 0) {
      const designerId = getDesignerIdFromResponse(existingDesigner);
      const folder = `Designers/Designer ${designerId}/`;
      const designFileUrl = await Promise.all(designFile.map((file) => uploadMedia(file, folder)));

      // Delete the existing videos if new URLs are provided
      if (existingDesigner.designerMedia.filter(mediaItem => mediaItem.mediaType === 'Image'&& mediaItem.purpose === 'designFile').length > 0) {
        const deleteMediaIds = existingDesigner.designerMedia.filter(mediaItem => mediaItem.mediaType === 'Image'&& mediaItem.purpose === 'designFile').map(mediaItem => mediaItem.id);
        await prisma.designerMedia.deleteMany({ where: { id: { in: deleteMediaIds } } });
      }

      designFileUrl.forEach((url, index) => {
        media.push({ link: url, mediaType: 'Image', purpose: 'designFile' });
        req.body[`designFile[${index}]`] = url;
      });
    }
    else {
      // Retain existing videos if no new URLs are provided
      media.push(...existingDesigner.designerMedia.filter(mediaItem => mediaItem.mediaType === 'Image'&& mediaItem.purpose === 'designFile'));
    }
  } else {
    // No new media uploaded, retain existing media
    media.push(...existingDesigner.designerMedia);
  }

  // Remove duplicate URLs from media array
  const uniqueMedia = media.reduce((acc, currentMedia) => {
    if (!acc.find(item => item.link === currentMedia.link)) {
      acc.push(currentMedia);
    }
    return acc;
  }, []);

  const updatedDesignerData = {
    firstName: firstName !== undefined ? firstName : existingDesigner.firstName,
    lastName: lastName !== undefined ? lastName : existingDesigner.lastName,
    email: email !== undefined ? email : existingDesigner.email,
    password: password !== undefined ? password : existingDesigner.password,
    gender: gender !== undefined ? gender : existingDesigner.gender,
    address: address !== undefined ? address : existingDesigner.address,
    country: country !== undefined ? country : existingDesigner.country,
    city: city !== undefined ? city : existingDesigner.city,
    state: state !== undefined ? state : existingDesigner.state,
    dateOfBirth: dateOfBirth !== undefined ? dateOfBirth : existingDesigner.dateOfBirth,
    category: category !== undefined ? category : existingDesigner.category,
    workingHours: workingHours !== undefined ? workingHours : existingDesigner.workingHours,
    paymentCondition: paymentCondition !== undefined ? paymentCondition : existingDesigner.paymentCondition,
    accountName: accountName !== undefined ? accountName : existingDesigner.accountName,
    accountNumber: accountNumber !== undefined ? accountNumberCount : existingDesigner.accountNumber,
    IFSC: IFSC !== undefined ? IFSC : existingDesigner.IFSC,
    website: website !== undefined ? website : existingDesigner.website,
    about: about !== undefined ? about : existingDesigner.about,
    customerRating: customerRating !== undefined ? customerRatingCount : existingDesigner.customerRating,
    totalEarnings: totalEarnings !== undefined ? totalEarningsCount : existingDesigner.totalEarnings,
    designerMedia: {
      create: uniqueMedia.map(item => ({
        link: item.link,
        mediaType: item.mediaType,
        purpose: item.purpose,
      })),
    },
    updatedAt: new Date(),
  };

  const updatedDesigner = await prisma.designer.update({
    where: { id: parseInt(id) },
    data: updatedDesignerData,
  });

  const response = {
    success: true,
    designer: {
      ...updatedDesigner,
      profilePhotoUrl: uniqueMedia.filter(
        (mediaItem) =>
          mediaItem.mediaType === 'Image' && mediaItem.purpose === 'profilePhoto'
      ).map((mediaItem) => mediaItem.link),
      IDProofUrl: uniqueMedia.filter(
        (mediaItem) =>
          mediaItem.mediaType === 'Image' && mediaItem.purpose === 'IDProof'
      ).map((mediaItem) => mediaItem.link),
      designFileUrl: uniqueMedia.filter(
        (mediaItem) =>
          mediaItem.mediaType === 'Image' && mediaItem.purpose === 'designFile'
      ).map((mediaItem) => mediaItem.link),
    },
  };
  res.status(200).json({
    ...response,
    profilePhotoUrl: response.profilePhotoUrl,
    IDProofUrl: response.IDProofUrl,
    designFileUrl: response.designFileUrl,
  });
} catch (err) {
  // Handle any errors that occur during the upload process
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message });
}
};
exports.getallprojects = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  try{
    
    const dummyProjects=await prisma.project.findMany({
      where:{
        designerId:{
          not:{
            equals:null,
          },
        },
      },
      include:{
        assignedToEmployee:true,
      },
    });
    // console.log(dummyProjects)
    const allProjects = dummyProjects.map((project) => {
      // Merge user data directly into the post object
      return {
        ...project,
        ...project.assignedToEmployee,
        assignedToEmployee: undefined, // Remove the nested user object
        projectId:project.id,
      };
    });
    
    
    return res.status(200).json({AllProjects:allProjects})
  }
  
  catch(error){
    // console.log(error)
    return res.status(500).json({message:"Interal server Error"});
  }
}
