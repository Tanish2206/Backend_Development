const axios = require("axios");
const helper = require("../utility/loginHelper");
const responses = require("../utility/response");
const nodemailer = require('nodemailer');
const prisma = require('../utility/prismaClient');

module.exports.enquiry = async (req, res, next) => {
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
        } else {
            console.log('Email sent:', info.response);
        }
        });

        res.json({ success: true, message: 'Inquiry sent and email notification sent.' });
    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({ success: false, message: 'Failed to create inquiry.' });
    }
};

exports.getPopularDesigns = async (req, res, next) => {
    const { id, count } = req.query; // Added 'count' parameter
  
    try {
      let whereCondition = {};
      if (id) {
        whereCondition = { id: parseInt(id) };
      }
  
      const popularDesignData = await prisma.popularDesign.findMany({
        where: whereCondition,
        include: {
          popularDesignMedia: {
            orderBy: { createdAt: 'desc' }, // Sort by createdAt field in descending order
            take: count ? parseInt(count) : undefined, // Take 'count' number of records if provided
          },
        },
      });
  
      const response_data = popularDesignData.map((popularDesign) => {
        const siteImagesUrls = popularDesign.popularDesignMedia
          .filter((media) => media.mediaType === 'Image')
          .map((media) => media.link);
  
        return {
          id: popularDesign.id,
          description: popularDesign.description,
          siteImagesUrls,
        };
      });
  
      // Reverse the response_data array to get the latest records first
      const reversedResponseData = response_data.reverse().slice(0, count ? parseInt(count) : undefined);
  
      res.send({
        response_code: 200,
        response_message: 'Success',
        response_data: reversedResponseData, // Send the modified response_data array
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

  exports.getBanners = async (req, res, next) => {
    const { id, count } = req.query;
    try {
      let whereCondition = {};
      if (id) {
        whereCondition = { id: parseInt(id) };
      }
  
      const bannerData = await prisma.banner.findMany({
        where: whereCondition,
        include: {
          bannerMedia: {
            orderBy: { createdAt: 'desc' },
            take: count ? parseInt(count) : undefined,
          },
        },
      });
  
      const response_data = bannerData.map((banner) => {
        const siteImagesUrls = banner.bannerMedia
          .filter((media) => media.mediaType === 'Image')
          .map((media) => media.link);
  
        return {
          id: banner.id,
          description: banner.description,
          siteImagesUrls,
        };
      });
  
      const reversedResponseData = response_data.reverse().slice(0, count ? parseInt(count) : undefined);
  
      res.send({
        response_code: 200,
        response_message: 'Success',
        response_data: reversedResponseData,
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

  exports.download = async (req, res, next) => {

    const s3BucketURL = req.query.url;
    const fileName = s3BucketURL.substring(s3BucketURL.lastIndexOf('/') + 1);

    try {
      const response = await axios.get(s3BucketURL, { responseType: 'arraybuffer' });
      const contentType = response.headers['content-type'];
      const contentDisposition = `attachment; filename=${fileName}`;
  
      res.set('Content-Type', contentType);
      res.set('Content-Disposition', contentDisposition);
      res.send(response.data);
    } catch (error) {
      res.status(500).send('Error downloading the image');
    }
  }