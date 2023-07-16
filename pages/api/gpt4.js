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
    let userPrompt = req.body.userPrompt;
    userPrompt = `Write a 5 page story with one sentence on each page for a 5-year-old child. 
    Make sure to start each page with "Page {page number}:". 
    The main character will be called Oscar. He is a cat.
    The story should be about ${userPrompt} 
    After the story, create a new section called Image Prompt. 
    Then summarize each page in 3 words for a 2-year old. Make sure to start each page with "Page {page number}:".
    `;

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.888,
        max_tokens: 2048,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        messages: [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": userPrompt},
        ]
    }, { timeout: 60000 });

    res.status(200).json({ answer: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
