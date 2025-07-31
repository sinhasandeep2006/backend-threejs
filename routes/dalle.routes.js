import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data'; // Required for multipart/form-data

dotenv.config();
const router = express.Router();

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // 1. Create FormData for multipart request
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'png'); // or 'jpeg'

    // 2. Make the API request
    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/sd3',
      formData,
      {
        headers: {
          ...formData.getHeaders(), // Sets 'Content-Type': 'multipart/form-data'
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: 'image/*',
        },
        responseType: 'arraybuffer', // To receive binary image data
      }
    );

    // 3. Convert the binary response to base64
    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    res.status(200).json({ photo: imageBase64 });

  } catch (error) {
    console.error("Error generating image:", error.response?.data || error.message);
    res.status(500).json({ 
      message: "Image generation failed",
      error: error.response?.data?.errors || error.message,
    });
  }
});

export default router;