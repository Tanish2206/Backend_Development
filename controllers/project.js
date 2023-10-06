const prisma = require('../utility/prismaClient');
const { uploadMedia } = require('../utility/AWSUtils');

const getProjectIdFromResponse = (projectResponse) => {
  return projectResponse.id; // Assuming the project ID is available as 'id' in the response.
};

exports.addProject = async (req, res) => {
  try {
    const { 
      description,
      location,
      latitude,
      longitude,
      width,
      length,
      totalAmount,
      paidAmount,
      isPaymentDone,
      isSiteVisitRequired,
      isSiteIrregular,
      currentIteration,
      maximumIterations,
      clientId, 
      title, 
      projectStatus,
      projectType 
    } = req.body;

    const siteImages = Array.isArray(req.files?.siteImagesUrls) ? req.files.siteImagesUrls : req.files?.siteImagesUrls ? [req.files.siteImagesUrls] : [];
    const videos = Array.isArray(req.files?.videosUrls) ? req.files.videosUrls : req.files?.videosUrls ? [req.files.videosUrls] : [];

    // Create the media array based on the uploaded URLs
    const media = [];

    // Create the project with the media array
    const project = await prisma.project.create({
      data: {
        title,
        projectType,
        // Do not include the media here, as it will be created separately
        client: {
          connect: { id: parseInt(clientId) },
        },
        description,
        projectStatus: projectStatus,
        location,
        latitude: parseInt(latitude),
        longitude: parseInt(longitude),
        width: parseInt(width),
        length: parseInt(length),
        totalAmount: parseInt(totalAmount),
        paidAmount: parseInt(paidAmount),
        isPaymentDone: Boolean(isPaymentDone),
        isSiteIrregular: Boolean(isSiteIrregular),
        isSiteVisitRequired: Boolean(isSiteVisitRequired),
        currentIteration: parseInt(currentIteration),
        maximumIterations: parseInt(maximumIterations),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Obtain the projectId from the created project object
    const projectId = getProjectIdFromResponse(project);
    const folder = `ProjectData/Project ${projectId}/InputData/`;

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
        projectId: project.id,
        ...item,
      })),
    });

    const response = {
      success: true,
      siteImagesUrls,
      videosUrls,
      project,
    };

    // Return a success response with the response object
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

exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.query;
    const {
      title,
      description,
      location,
      latitude,
      longitude,
      width,
      length,
      totalAmount,
      paidAmount,
      isPaymentDone,
      isSiteVisitRequired,
      isSiteIrregular,
      currentIteration,
      maximumIterations,
      clientId,
      projectStatus,
      projectType,
    } = req.body;

    const latitudeCount = isNaN(parseInt(latitude)) ? null : parseInt(latitude);
    const longitudeCount = isNaN(parseInt(longitude)) ? null : parseInt(longitude);
    const totalAmountCount = isNaN(parseInt(totalAmount)) ? null : parseInt(totalAmount);
    const paidAmountCount = isNaN(parseInt(paidAmount)) ? null : parseInt(paidAmount);
    const currentIterationCount = isNaN(parseInt(currentIteration)) ? null : parseInt(currentIteration);
    const maximumIterationsCount = isNaN(parseInt(maximumIterations)) ? null : parseInt(maximumIterations);
    const lengthCount = isNaN(parseInt(length)) ? null : parseInt(length);
    const widthCount = isNaN(parseInt(width)) ? null : parseInt(width);

    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: { media: true },
    });

    if (!existingProject) {
      throw new Error('Project not found.');
    }

    const media = [];

    if (req.files) {
      const siteImagesFiles = Array.isArray(req.files.siteImagesUrls) ? req.files.siteImagesUrls : req.files.siteImagesUrls ? [req.files.siteImagesUrls] : [];
      const videosFiles = Array.isArray(req.files.videosUrls) ? req.files.videosUrls : req.files.videosUrls ? [req.files.videosUrls] : [];

      // Check if new siteImages are uploaded, otherwise retain the existing ones
      if (siteImagesFiles.length > 0) {
        const projectId = getProjectIdFromResponse(existingProject);
        const folder = `ProjectData/Project ${projectId}/InputData/`;
        const siteImagesUrls = await Promise.all(siteImagesFiles.map((file) => uploadMedia(file, folder)));

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
      title: title !== undefined ? title : existingProject.title,
      description: description !== undefined ? description : existingProject.description,
      isPaymentDone: isPaymentDone !== undefined && isPaymentDone !== null ? JSON.parse(isPaymentDone) : existingProject.isPaymentDone,
      isSiteVisitRequired: isSiteVisitRequired !== undefined && isSiteVisitRequired !== null ? JSON.parse(isSiteVisitRequired) : existingProject.isSiteVisitRequired,
      isSiteIrregular: isSiteIrregular !== undefined && isSiteIrregular !== null ? JSON.parse(isSiteIrregular) : existingProject.isSiteIrregular,
      latitude: latitude !== undefined ? latitudeCount : existingProject.latitude,
      longitude: longitude !== undefined ? longitudeCount : existingProject.longitude,
      totalAmount: totalAmount !== undefined ? totalAmountCount : existingProject.totalAmount,
      location: location !== undefined && location !== ''? location : existingProject.location,
      paidAmount: paidAmount !== undefined ? paidAmountCount : existingProject.paidAmount,
      currentIteration: currentIteration !== undefined ? currentIterationCount : existingProject.currentIteration,
      length: length !== undefined ? lengthCount : existingProject.length,
      width: width !== undefined ? widthCount : existingProject.width,
      maximumIterations: maximumIterations !== undefined ? maximumIterationsCount : existingProject.maximumIterations,
      projectStatus: projectStatus !== undefined && projectStatus !== '' ? projectStatus : existingProject.projectStatus,
      projectType: projectType !== undefined && projectType !== '' ? projectType : existingProject.projectType,

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
      project: updatedProject,
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

// exports.getProjects = async (req, res, next) => {
//   const { clientId } = req.query;
//   try {
//     const projects = await prisma.project.findMany({
//       where: { clientId: parseInt(clientId) },
//       include: {
//         media: true,
//       },
//     });

//     res
//       .status(200)
//       .json({ message: "Projects retrieved successfully", projects });
//   } catch (error) {
//     console.error("Error retrieving projects:", error);
//     res.status(500).json({ error: "Failed to retrieve projects" });
//   }
// };

exports.getProjects = async (req, res, next) => {
  const { clientId, projectId } = req.query;
  try {
    let whereCondition = {};
    if (clientId) {
      whereCondition.clientId = parseInt(clientId);
    }
    if (projectId) {
      whereCondition.id = parseInt(projectId);
    }

    const projects = await prisma.project.findMany({
      where: whereCondition,
      include: {
        media: true,
      },
    });

    const response_data = projects.map((project) => {
      const uniqueSiteImagesUrls = [...new Set(
        project.media
          .filter((media) => media.mediaType === 'Image')
          .map((media) => media.link)
      )];
      const uniqueVideosUrls = [...new Set(
        project.media
          .filter((media) => media.mediaType === 'Video')
          .map((media) => media.link)
      )];

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
        siteImagesUrls: uniqueSiteImagesUrls,
        videosUrls: uniqueVideosUrls,
      };
    });

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

exports.deleteProject = async (req, res, next) => {
  const { id } = req.query;
  try {
    // Delete associated media records
    await prisma.media.deleteMany({
      where: { projectId: parseInt(id) },
    });

    // Delete the project
    const deletedProject = await prisma.project.delete({
      where: { id: parseInt(id) },
    });

    if (deletedProject) {
      res.status(200).json({ message: "Project deleted successfully" });
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};

exports.getProjectsForAdmin = async (req, res, next) => {
  const { clientId, projectId } = req.query;
  try {
    let whereCondition = {};
    if (clientId) {
      whereCondition.clientId = parseInt(clientId);
    }
    if (projectId) {
      whereCondition.id = parseInt(projectId);
    }

    const projects = await prisma.project.findMany({
      where: whereCondition,
      include: {
        media: true,
      },
    });

    const response_data = projects.map((project) => {
      const uniqueSiteImagesUrls = [...new Set(
        project.media
          .filter((media) => media.mediaType === 'Image')
          .map((media) => media.link)
      )];
      const uniqueVideosUrls = [...new Set(
        project.media
          .filter((media) => media.mediaType === 'Video')
          .map((media) => media.link)
      )];

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
        projectStatusByDesigner: project.projectStatusByDesigner,
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
        siteImagesUrls: uniqueSiteImagesUrls,
        videosUrls: uniqueVideosUrls,
      };
    });

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