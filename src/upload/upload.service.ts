import { Injectable } from '@nestjs/common';
import {v2 as cloudinary} from 'cloudinary'
@Injectable()
export class UploadService {
    constructor(){
    cloudinary.config({
      cloud_name: process.env.NAME_CLOUD,
      api_key: process.env.KEY_API,
      api_secret: process.env.SECRET_API,
    })
    }
    async uploadImage(filePath: string){
        try {
            const result = await cloudinary.uploader.upload(filePath);
            return result.secure_url;    
        } catch (error) {
            console.log(error)
        }
    }
}
