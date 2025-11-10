import { Injectable } from '@nestjs/common';
import {v2 as cloudinary} from 'cloudinary'
import { ImageObject } from 'src/place/types/image_object';
import { Readable } from 'stream';
@Injectable()
export class UploadService {
    constructor(){
    cloudinary.config({
      cloud_name: process.env.NAME_CLOUD,
      api_key: process.env.KEY_API,
      api_secret: process.env.SECRET_API,
    })
    }
    async uploadImage(buffer: Buffer): Promise<ImageObject> {

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'places' }, (error, result) => {
                    if (error || !result) return reject(error || new Error('Upload falhou!'))
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id
                    })

                }
            )

            const readable = new Readable()
            readable.push(buffer)
            readable.push(null)
            readable.pipe(stream)
        })
    }

    async deleteImage(public_id: string): Promise<void> {
        await cloudinary.uploader.destroy(public_id)
    }
}