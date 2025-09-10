import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary environment variables are available
const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME && 
                           process.env.CLOUDINARY_API_KEY && 
                           process.env.CLOUDINARY_API_SECRET;

// Log environment variables for debugging (without exposing secrets)
console.log('Cloudinary configuration check:', {
  hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
  hasApiKey: !!process.env.CLOUDINARY_API_KEY,
  hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ? `${process.env.CLOUDINARY_CLOUD_NAME.substring(0, 3)}...` : 'missing'
});

// Only configure Cloudinary if all required variables are present
if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configuration loaded successfully');
} else {
  console.warn('⚠️  WARNING: Cloudinary environment variables are not fully configured!');
  console.warn('File storage will use database fallback only');
}

export { cloudinary as default, hasCloudinaryConfig };
