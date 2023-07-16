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
    let imageName = req.body.imageName;
    let animalType = req.body.animalType;

    userPrompt = `Write a 5 page story with 2 sentences on each page for a 10-year-old child. 
    The main character will be called ${imageName}. He is a ${animalType}. The story should be about ${userPrompt}
    Then summarize each page describing an image you could see in a story book for a 2-year old. 
    Do not describe ${imageName}. We already know what he looks like.

    Your response should be in the following format. Do not include any other headers.
    Page 1: XXX
    Page 2: XXX
    Page 3: XXX
    Page 4: XXX
    Page 5: XXX

    Page 1: XXX
    Page 2: XXX
    Page 3: XXX
    Page 4: XXX
    Page 5: XXX
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
