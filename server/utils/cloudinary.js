import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'


cloudinary.config({
    cloud_name: 'dro8qbk8j',
    api_key: '958499273355173',
    api_secret: 'Q5JBUFqnQTMyvh3acoaJFEdx50w'
})

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
    
    fs.unlinkSync(localFilePath)
    return response
} catch (error) {
    fs.unlinkSync(localFilePath)
    return null
}
}