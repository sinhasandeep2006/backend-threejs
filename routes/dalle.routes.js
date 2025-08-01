import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const router = express.Router();

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/DeepFloyd/IF-I-XL-v1.0',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
        responseType: 'arraybuffer',
      }
    );

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