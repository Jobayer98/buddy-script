import cloudinary from "../config/cloudinary";
import logger from "../config/logger";
import { Readable } from "stream";

interface UploadResult {
  url: string;
  publicId: string;
}

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = "social-media"
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto:good" },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error("Upload failed"));
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error({ err: error, publicId }, "Error deleting from Cloudinary");
  }
};
