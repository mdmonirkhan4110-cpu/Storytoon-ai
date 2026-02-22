const axios = require('axios');
const natural = require('natural');

// স্ক্রিপ্টকে প্রম্পটে ভাগ করা
exports.splitScript = async (req, res) => {
  try {
    const { script } = req.body;

    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }

    // স্ক্রিপ্টকে বাক্যে ভাগ করুন
    const tokenizer = new natural.SentenceTokenizer();
    const sentences = tokenizer.tokenize(script);

    // প্রতি 2-3 বাক্যকে একটি প্রম্পটে রূপান্তরিত করুন
    const prompts = [];
    let currentPrompt = '';

    sentences.forEach((sentence, index) => {
      currentPrompt += sentence + ' ';

      if ((index + 1) % 3 === 0 || index === sentences.length - 1) {
        prompts.push({
          id: prompts.length + 1,
          text: currentPrompt.trim(),
          original_sentence: sentence
        });
        currentPrompt = '';
      }
    });

    res.json({
      total_prompts: prompts.length,
      prompts: prompts,
      script_length: script.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ইমেজ জেনারেশন (Hugging Face API ব্যবহার করে - ফ্রি)
exports.generateImage = async (req, res) => {
  try {
    const { prompt, promptId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const HF_TOKEN = process.env.HUGGING_FACE_TOKEN;

    // Hugging Face Inference API কল করুন
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/DPM-Solver/Stable-diffusion-v1-5',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
        },
        responseType: 'arraybuffer'
      }
    );

    const imageBuffer = Buffer.from(response.data, 'binary');
    const imagePath = `uploads/image_${promptId}_${Date.now()}.png`;

    fs.writeFileSync(imagePath, imageBuffer);

    res.json({
      promptId: promptId,
      imagePath: `/${imagePath}`,
      success: true
    });

  } catch (error) {
    console.error('Image generation error:', error.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};