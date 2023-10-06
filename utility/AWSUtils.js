const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const uploadMedia = async (file, folder) => {
  try {
    const fileContent = Buffer.from(file.data, 'base64');
    const fileName = file.name;

    if (isS3Configured()) {
      const AWS = require('aws-sdk');
      AWS.config.update({
        region: process.env.S3_AWS_REGION_NAME,
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      });
      const s3 = new AWS.S3();

      const params = {
        Bucket: process.env.S3_AWS_BUCKET_NAME,
        Key: folder + fileName,
        Body: fileContent,
        ContentType: file.mimetype
      };

      return new Promise((resolve, reject) => {
        s3.upload(params, (err, media) => {
          if (err) {
            // If there's an error with AWS S3, store the file locally
            console.error('Error with AWS S3:', err);
            storeLocally(fileContent, folder, fileName)
              .then(localPath => {
                resolve(localPath);
              })
              .catch(localErr => {
                reject(localErr);
              });
          } else {
            resolve(media.Location); // Return only the URL of the uploaded media
          }
        });
      });
    } else {
      // If AWS is not configured, store the file locally
      return storeLocally(fileContent, folder, fileName);
    }
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};

// Function to store the file locally
const storeLocally = async (fileContent, folder, fileName) => {
  const writeFile = promisify(fs.writeFile);
  const localStoragePath = 'C:/Personal/daji4/daji/frontend/local-storage/';

  // Create the full path by joining the base path, folder name, and file name
  const fullLocalPath = path.join(localStoragePath, folder, fileName);

  // Create directories if they don't exist
  const directoryPath = path.dirname(fullLocalPath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Write the file to the full local path
  await writeFile(fullLocalPath, fileContent);
  return fullLocalPath;
};

// Function to check if AWS S3 configuration is set up
function isS3Configured() {
  return (
    process.env.S3_AWS_REGION_NAME &&
    process.env.S3_ACCESS_KEY &&
    process.env.S3_SECRET_KEY &&
    process.env.S3_AWS_BUCKET_NAME
  );
}

module.exports = {
  uploadMedia
};