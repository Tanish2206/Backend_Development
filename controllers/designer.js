const axios = require("axios");
const helper = require("../utility/loginHelper");
const nodemailer = require('nodemailer');
const prisma = require('../utility/prismaClient');
const { uploadMedia } = require('../utility/AWSUtils');


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

// module.exports.register = async (req, res, next) => {
//     BigInt.prototype.toJSON = function () {
//         return this.toString();
//       };
//     try {
//     const { name, email, mobile, gender, address, dateOfBirth } = req.body;
//     let designer = await prisma.designer.findUnique({
//       where: { mobile: BigInt(mobile) },
//     });
//     if (designer)
//       return res.status(400).json({ message: "user already registered" });
//       designer = await prisma.designer.create({
//       data: {
//         name,
//         email,
//         gender,
//         address,
//         dateOfBirth,
//         mobile: BigInt(mobile),
//       },
//     });
//     const  designerId = designer.id;
//     const code = await helper.generateDesignerOTP(designerId);
//     console.log(code);

//     //await sendOTPOnMobile(mobile, code);

//     return res.status(200).json({
//       designerId: designerId,
//       message: "OTP sent succesfully.",
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).send("Internal Server error");
//   }
// };

// module.exports.login = async (req, res, next) => {
//   try {
//     const { mobile } = req.body;
//     let designer = await prisma.designer.findUnique({
//       where: { mobile: BigInt(mobile) },
//     });

//     if (!designer) return res.status(400).json({ message: "User not found" });

//     if (designer.status === 0) {
//       return res.status(401).json({ message: "User is inactive" });
//     }

//     const designerId = designer.id;
//     const code = await helper.generateDesignerOTP(designerId);
//     console.log(code);
//     //await sendOTPOnMobile(mobile, code);

//     return res.status(200).json({
//         designerId: designerId,
//       message: "OTP sent successfully.",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal Server error");
//   }
// };

// module.exports.verifyOTP = async (req, res, next) => {
//   const { designerId, code } = req.body;

//   const designerOTP = await prisma.OTP.findUnique({
//     where: { designerId: designerId },
//   });

//   if (parseInt(designerOTP.code) === parseInt(code)) {
//     let updatedDesigner = await prisma.designer.update({
//       where: { id: designerId },
//       data: { isVerified: true },
//     });

//     if (!updatedDesigner) return res.status(400).Error("Failed to verify user");

//     const token = helper.createToken({
//         designerId: designerId,
//       role: updatedDesigner.role,
//     });

//     // Add the token entry in the Users table
//     await prisma.designer.update({
//       where: { id: designerId },
//       data: { token: token },
//     });

//     // Delete the otp entry for the user
//     await prisma.OTP.delete({
//       where: {
//         designerId: designerId,
//       },
//     });

//     return res
//       .status(200)
//       .cookie("jwt", token, {
//         httpOnly: false,
//         maxAge: 3600 * 24 * 1000,
//       })
//       .json({
//         message: "OTP verified",
//         designerId: updatedDesigner.id,
//         authToken: token,
//       });
//   }

//   return res.status(400).send({ Error: "Invalid OTP" });
// };

const getDesignerIdFromResponse = (designerResponse) => {
  return designerResponse.id; // Assuming the project ID is available as 'id' in the response.
};

const getProjectIdFromResponse = (projectResponse) => {
  return projectResponse.id; // Assuming the project ID is available as 'id' in the response.
};

module.exports.register = async (req, res, next) => {
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

    const code = await helper.generateDesignerOTP(designerId);
    console.log(code);

    //await sendOTPOnMobile(mobile, code);

    return res.status(200).json({
      userId: designerId,
      message: "OTP sent successfully.",
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports.getprofile = async (req, res, next) => {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  try {
    const { id } = req.query;

    const designer = await prisma.designer.findUnique({
      where: { id: parseInt(id) },
      include: {
        designerMedia: true,
      },
    });
    const countDesigner= await prisma.Project.findMany({
        where:{
          projectStatusByDesigner:"completed",
          designerId:parseInt(id),
         },
         include:{
          assignedToEmployee:true,
         },
    });
    // console.log(countDesigner)
    const ProjectsCompleted=countDesigner.length;
    // console.log(ProjectsCompleted)
    
    

    if (!designer) return res.status(400).json({ message: "designer not found" });

    if (!designer.isVerified)
      return res.status(400).json({ message: "user not verified" });

    // Make sure that JWT token corresponds to the requested user
    if (req.userData.designerId !== designer.id) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    // Filter the designerMedia to get unique URLs for profilePhotoUrl, IDProofUrl, and designFileUrl
    const profilePhotoUrls = designer.designerMedia
      .filter(mediaItem => mediaItem.mediaType === 'Image' && mediaItem.purpose === 'profilePhoto')
      .map(mediaItem => mediaItem.link);

    const IDProofUrls = designer.designerMedia
      .filter(mediaItem => mediaItem.mediaType === 'Image' && mediaItem.purpose === 'IDProof')
      .map(mediaItem => mediaItem.link);

    const designFileUrls = designer.designerMedia
      .filter(mediaItem => mediaItem.mediaType === 'Image' && mediaItem.purpose === 'designFile')
      .map(mediaItem => mediaItem.link);

    const response_data = {
      id: designer.id,
      firstName: designer.firstName,
      lastName: designer.lastName,
      email: designer.email,
      mobile: designer.mobile,
      gender: designer.gender,
      address: designer.address,
      country: designer.country,
      city: designer.city,
      state: designer.state,
      dateOfBirth: designer.dateOfBirth,
      category: designer.category,
      workingHours: designer.workingHours,
      paymentCondition: designer.paymentCondition,
      accountName: designer.accountName,
      accountNumber: designer.accountNumber,
      IFSC: designer.IFSC,
      website: designer.website,
      about: designer.about,
      customerRating: designer.customerRating,
      totalEarnings: designer.totalEarnings,
      ProjectsCompleted:ProjectsCompleted,
      profilePhotoUrl: [...new Set(profilePhotoUrls)],   // Convert to Set to make URLs unique
      IDProofUrl: [...new Set(IDProofUrls)],             // Convert to Set to make URLs unique
      designFileUrl: [...new Set(designFileUrls)],       // Convert to Set to make URLs unique
    };

    res.send({
      response_code: 200,
      response_message: 'Success',
      response_data,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send({
      response_code: 500,
      response_message: 'Error',
      response_data: err.message,
    });
  }
};

// exports.updateDesigner = async (req, res, next) => {
//   BigInt.prototype.toJSON = function () {
//     return this.toString();
//   };
//   try {
//     const { id } = req.query;
//     const { 
//       firstName,
//       lastName,
//       email,
//       password,
//       gender,
//       address,
//       country,
//       city,
//       state,
//       dateOfBirth,
//       category,
//       workingHours,
//       paymentCondition,
//       accountName,
//       accountNumber,   
//       IFSC,
//       website,
//       about 
//     } = req.body;

//     const updatedDesigner = await prisma.designer.update({
//       where: { id: parseInt(id) },
//       data: {
//           firstName,
//           lastName,
//           email,
//           password,
//           gender,
//           address,
//           country,
//           city,
//           state,
//           dateOfBirth,
//           category,
//           workingHours,
//           paymentCondition,
//           accountName,
//           accountNumber: BigInt(accountNumber),   
//           IFSC,
//           website,
//           about,
//       },
//     });
//     res.json({
//       message: "User Details Updated Successfully",
//       designer: updatedDesigner,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update user" });
//   }
// };

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
      about 
    } = req.body;

    const accountNumberCount = isNaN(parseInt(accountNumber)) ? null : parseInt(accountNumber);

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

exports.getProjects = async (req, res, next) => {
  try {
    const designerId = parseInt(req.query.designerId);
    const projectId = parseInt(req.query.projectId);

    // Check if designerId is a valid number
    const isDesignerIdValid = !isNaN(designerId);

    let projects;

    if (isDesignerIdValid) {
      // Fetch projects based on designerId
      if (!isNaN(projectId)) {
        // Fetch a specific project based on both designerId and projectId
        const project = await prisma.project.findFirst({
          where: { id: projectId, designerId: designerId },
          include: {
            media: true, // Include the media data for the project
          },
        });

        projects = project ? [project] : [];
      } else {
        // Fetch all projects based on designerId only
        projects = await prisma.project.findMany({
          where: { designerId: designerId },
          include: {
            media: true, // Include the media data for each project
          },
        });
      }
    } else {
      // If designerId is not provided or not a valid number, return empty array
      projects = [];
    }

    const response_data = projects.map((project) => {
      const uniqueSiteImagesUrls = new Set(
        project.media
          .filter((media) => media.mediaType === 'Image')
          .map((media) => media.link)
      );
      const uniqueVideosUrls = new Set(
        project.media
          .filter((media) => media.mediaType === 'Video')
          .map((media) => media.link)
      );

      return {
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
        siteImagesUrls: Array.from(uniqueSiteImagesUrls), // Convert Set to array
        videosUrls: Array.from(uniqueVideosUrls), // Convert Set to array
      };
    });

    res.status(200).json({
      message: "Projects assigned to designer",
      projects: response_data,
    });
  } catch (error) {
    console.error("Error fetching projects assigned to designer:", error);
    res.status(500).json({ error: "Failed to fetch projects assigned to designer" });
  }
};

exports.updateProjectStatus = async (req, res, next) => {
  try {
    const projectId = parseInt(req.query.projectId);
    const designerId = parseInt(req.query.designerId);
    const { projectStatusByDesigner } = req.body;

    // Check if projectId and designerId are valid numbers
    const isProjectIdValid = !isNaN(projectId);
    const isDesignerIdValid = !isNaN(designerId);

    if (!isProjectIdValid || !isDesignerIdValid) {
      return res.status(400).json({ error: 'Invalid projectId or designerId' });
    }

    // Check if the designer is authorized to update the projectStatus
    const isDesignerAssigned = await prisma.project.findFirst({
      where: { id: projectId, designerId: designerId },
    });

    if (!isDesignerAssigned) {
      return res.status(403).json({ error: 'Unauthorized. Project not assigned to the designer' });
    }

    // Update the projectStatus for the specified project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { projectStatusByDesigner },
    });

    res.status(200).json({
      message: 'Project status updated successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ error: 'Failed to update project status' });
  }
};

exports.addMedia = async (req, res) => {
  try {
    const { projectId, designerId } = req.body;

    // Check if the designer is assigned to the specified project
    const assignedProject = await prisma.project.findFirst({
      where: {
        id: parseInt(projectId),
        designerId: parseInt(designerId),
      },
    });

    if (!assignedProject) {
      return res.status(403).json({
        success: false,
        error: 'Project is not assigned to the specified designer.',
      });
    }

    const siteImages = Array.isArray(req.files?.siteImagesUrls) ? req.files.siteImagesUrls : req.files?.siteImagesUrls ? [req.files.siteImagesUrls] : [];
    const videos = Array.isArray(req.files?.videosUrls) ? req.files.videosUrls : req.files?.videosUrls ? [req.files.videosUrls] : [];

    const media = [];

    // Obtain the projectId from the provided project ID
    const folder = `ProjectData/Project ${projectId}/OutputData/`;

    // Upload site images to S3 and handle the uploaded media
    let siteImagesUrls = [];
    if (siteImages.length > 0) {
      siteImagesUrls = await Promise.all(siteImages.map((file) => uploadMedia(file, folder)));
      siteImagesUrls.forEach((url) => {
        media.push({ link: url, mediaType: 'Image' });
      });
    }

    // Upload videos to S3 and handle the uploaded media
    let videosUrls = [];
    if (videos.length > 0) {
      videosUrls = await Promise.all(videos.map((file) => uploadMedia(file, folder)));
      videosUrls.forEach((url) => {
        media.push({ link: url, mediaType: 'Video' });
      });
    }

    // Create the media records associated with the project
    const createdMedia = await prisma.media.createMany({
      data: media.map((item) => ({
        projectId: assignedProject.id,
        ...item,
      })),
    });

    // Return a success response with the response object
    res.status(200).json({
      success: true,
      siteImagesUrls,
      videosUrls,
      // project: assignedProject,
    });
  } catch (err) {
    // Handle any errors that occur during the upload process
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateMedia = async (req, res, next) => {
  try {
    const { id } = req.query;

    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: { media: true },
    });

    if (!existingProject) {
      throw new Error('Project not found.');
    }

    const media = [];

    if (req.files) {
      const  profilePhoto = Array.isArray(req.files.siteImagesUrls) ? req.files.siteImagesUrls : req.files.siteImagesUrls ? [req.files.siteImagesUrls] : [];
      const videosFiles = Array.isArray(req.files.videosUrls) ? req.files.videosUrls : req.files.videosUrls ? [req.files.videosUrls] : [];

      // Check if new siteImages are uploaded, otherwise retain the existing ones
      if ( profilePhoto.length > 0) {
        const projectId = getProjectIdFromResponse(existingProject);
        const folder = `ProjectData/Project ${projectId}/OutputData/`;
        const siteImagesUrls = await Promise.all( profilePhoto.map((file) => uploadMedia(file, folder)));

        // Delete the existing siteImages if new URLs are provided
        if (existingProject.media.filter(mediaItem => mediaItem.mediaType === 'Image').length > 0) {
          const deleteMediaIds = existingProject.media.filter(mediaItem => mediaItem.mediaType === 'Image').map(mediaItem => mediaItem.id);
          await prisma.media.deleteMany({ where: { id: { in: deleteMediaIds } } });
        }

        siteImagesUrls.forEach((url, index) => {
          media.push({ link: url, mediaType: 'Image' });
          req.body[`siteImages[${index}]`] = url;
        });
      } else {
        // Retain existing siteImages if no new URLs are provided
        media.push(...existingProject.media.filter(mediaItem => mediaItem.mediaType === 'Image'));
      }

      // Check if new videos are uploaded, otherwise retain the existing ones
      if (videosFiles.length > 0) {
        const projectId = getProjectIdFromResponse(existingProject);
        const folder = `ProjectData/Project ${projectId}/InputData/`;
        const videosUrls = await Promise.all(videosFiles.map((file) => uploadMedia(file, folder)));

        // Delete the existing videos if new URLs are provided
        if (existingProject.media.filter(mediaItem => mediaItem.mediaType === 'Video').length > 0) {
          const deleteMediaIds = existingProject.media.filter(mediaItem => mediaItem.mediaType === 'Video').map(mediaItem => mediaItem.id);
          await prisma.media.deleteMany({ where: { id: { in: deleteMediaIds } } });
        }

        videosUrls.forEach((url, index) => {
          media.push({ link: url, mediaType: 'Video' });
          req.body[`videos[${index}]`] = url;
        });
      }
      else {
        // Retain existing videos if no new URLs are provided
        media.push(...existingProject.media.filter(mediaItem => mediaItem.mediaType === 'Video'));
      }
    } else {
      // No new media uploaded, retain existing media
      media.push(...existingProject.media);
    }

    // Remove duplicate URLs from media array
    const uniqueMedia = media.reduce((acc, currentMedia) => {
      if (!acc.find(item => item.link === currentMedia.link)) {
        acc.push(currentMedia);
      }
      return acc;
    }, []);

    const updatedProjectData = {
      media: {
        create: uniqueMedia.map(item => ({
          link: item.link,
          mediaType: item.mediaType,
        })),
      },
      updatedAt: new Date(),
    };

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: updatedProjectData,
    });

    const response = {
      success: true,
      siteImagesUrls: uniqueMedia.filter(mediaItem => mediaItem.mediaType === 'Image').map(mediaItem => mediaItem.link),
      videosUrls: uniqueMedia.filter(mediaItem => mediaItem.mediaType === 'Video').map(mediaItem => mediaItem.link),
      // project: updatedProject,
    };

    res.status(200).json({
      ...response,
      siteImagesUrls: response.siteImagesUrls,
      videosUrls: response.videosUrls,
    });
  } catch (err) {
    // Handle any errors that occur during the upload process
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.designerRespondToProject = async (req, res, next) => {
  try {
    const { projectId, designerId, response, comment, dueDate, paymentDueDate } = req.body;

    // Check if the response is valid (e.g., 'accept' or 'reject')
    if (response !== 'accept' && response !== 'reject') {
      return res.status(400).json({ error: 'Invalid response. Please specify either "accept" or "reject".' });
    }

    // Determine the value of isAccepted based on the designer's response
    const isAccepted = response === 'accept';

    // Update the project's assignedDesignerId and isAccepted based on the designer's response
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: {
        designerId: isAccepted ? parseInt(designerId) : null,
        isAccepted: isAccepted,
        comment,
        dueDate,
        paymentDueDate,
      },
    });

    // Return the updated project data
    res.status(200).json({
      message: `Project ${isAccepted ? 'accepted' : 'rejected'} successfully`,
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error responding to project:', error);
    res.status(500).json({ error: 'Failed to respond to project' });
  }
};


exports.getAcceptedProjects = async (req, res, next) => {
  try {
    // Get the designer's ID from the request or your authentication system
    const designerId = parseInt(req.query.designerId);

    // Retrieve all projects assigned to the designer that are accepted
    const acceptedProjects = await prisma.project.findMany({
      where: {
        designerId: designerId,
        isAccepted: true,
      },
      include: {
        media: true, // Include the media data for each accepted project
      },
    });

    const response_data = acceptedProjects.map((project) => {
      const uniqueSiteImagesUrls = new Set(
        project.media
          .filter((media) => media.mediaType === 'Image')
          .map((media) => media.link)
      );
      const uniqueVideosUrls = new Set(
        project.media
          .filter((media) => media.mediaType === 'Video')
          .map((media) => media.link)
      );

      return {
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
        projectStatusByDesigner:project.projectStatusByDesigner,
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
        siteImagesUrls: Array.from(uniqueSiteImagesUrls), // Convert Set to array
        videosUrls: Array.from(uniqueVideosUrls), // Convert Set to array
      };
    });

    res.status(200).json({
      message: 'Accepted projects retrieved successfully',
      projects: response_data,
    });
  } catch (error) {
    console.error('Error fetching accepted projects:', error);
    res.status(500).json({ error: 'Failed to fetch accepted projects' });
  }
};
