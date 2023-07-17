const dotenv = require('dotenv');
dotenv.config();

const { Configuration, OpenAIApi } = require('openai');
let openai;

export default async function handler(req, res) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  openai = new OpenAIApi(configuration);

  try {
    const firstPrompt = req.body.firstPrompt;

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.888,
        max_tokens: 2048,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        messages: [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": firstPrompt }
        ]
    }, { timeout: 60000 });

    res.status(200).json({ answer: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
