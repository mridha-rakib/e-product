import env from "@/env";
import { v2 as cloudinary, ConfigOptions } from "cloudinary";

const cloudinaryV2 = cloudinary;

const config = (): void => {
  cloudinaryV2.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME as string,
    api_key: env.CLOUDINARY_API_KEY as string,
    api_secret: env.CLOUDINARY_API_SECRET as string,
    secure: true,
  } as ConfigOptions);
};

export { config, cloudinaryV2 as cloudinary };
