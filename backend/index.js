const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

var allowedOrigins = {
  origin: [
    "https://blog-summerizer-one.vercel.app",
  ],
  credentials: true 
};

app.use(cors(allowedOrigins));


app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
const HF_API_KEY = process.env.HUGGING_FACE_TOKEN; 

app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    const summary = data[0]?.summary_text || "No summary generated.";
    res.json({ summary });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to summarize the blog.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
