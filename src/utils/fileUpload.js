const aws = require('aws-sdk');
const APIError = require("../utils/APIError");
const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});


require('dotenv').config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'dfk7s7koj',
  api_key: '322527421493417',
  api_secret: '6HmTTvv28g4p24mDrW9G4rZ989E'
});

exports.uploadFile = async (file, path, filename) => {
  await file.mv(path + filename)
}

exports.uploadToS3 = async (file) => {
  if (!file) {
    throw new Error("File is undefined or null");
  }

  console.log("bucket key===========>", file);
  const uploadParam = {
    Bucket: "furni-uploads",
    Key: `Furni -  ${file.name}`,
    Body: file.data,
    ContentType: file.mimetype,
  };
  console.log("uploadParam====>", uploadParam);
  let result = await s3.upload(uploadParam).promise();
  return result.Location;
};

exports.deleteObjectFromS3 = async (url) => {
  const parsedUrl = new URL(url);
  const key = parsedUrl.pathname.substring(1);
  // Set the parameters for deleting the object
  const params = {
    Bucket: process.env.BUCKET_KEY,
    Key: key,
  };

  // Initiate the deletion request to S3
  try {
    await s3.deleteObject(params).promise();
    console.log('Object deleted from S3 successfully');
  } catch (err) {
    console.error('Error deleting object from S3:', err);
  }
  return
};

exports.uploadToCloudinary = async (imageFile, options) => {


  console.log(imageFile)
  console.log(options)
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(imageFile, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}