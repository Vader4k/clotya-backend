import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary.
 * @param {string} fileData - Base64 string or file buffer.
 * @param {string} folder - Optional folder name in Cloudinary.
 * @returns {Promise<string>} The secure URL of the uploaded image.
 */
export const uploadToCloudinary = async (fileData, folder = 'products') => {
    try {
        if (!fileData) return null;

        // Log basic info about the data being received
        console.log('Testing upload to Cloudinary. Data starts with:', fileData.substring(0, 30));

        if (typeof fileData === 'string' && fileData.startsWith('blob:')) {
            throw new Error('Received a browser blob URL. Frontend must convert image to base64 before sending.');
        }

        const uploadResponse = await cloudinary.uploader.upload(fileData, {
            folder: folder,
            resource_type: 'auto',
        });
        return uploadResponse.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error details:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to upload image to Cloudinary');
    }
};

/**
 * Deletes an image from Cloudinary using its public ID.
 * @param {string} imageUrl - Full secure URL of the image.
 */
export const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return;
        
        // Extract public ID from the URL
        // Format: https://res.cloudinary.com/cloud_name/image/upload/v12345678/folder/public_id.jpg
        const parts = imageUrl.split('/');
        const filenameWithExtension = parts.pop();
        const folder = parts.pop();

        if (filenameWithExtension) {
            const publicId = `${folder}/${filenameWithExtension.split('.')[0]}`;
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (error) {
        console.error('Cloudinary deletion error:', error);
        // We don't necessarily want to throw here to avoid blocking DB deletes if image delete fails
    }
};
