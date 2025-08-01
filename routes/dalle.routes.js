import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const router = express.Router();

// Hugging Face recommended model: stable-diffusion-2
const MODEL_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2';

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await axios.post(
      MODEL_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          Accept: 'image/png', // expecting image
        },
        responseType: 'arraybuffer', // receive binary image
      }
    );

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.status(200).json({ photo: imageUrl });
  } catch (error) {
    console.error("🔥 Image generation failed!");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data || error.message);

    res.status(500).json({
      message: 'Image generation failed',
      error: error.response?.data || error.message,
    });
  }
});

export default router;
