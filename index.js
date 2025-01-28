const axios = require("axios");
require("dotenv").config(); // Loads environment variables
const { twitterClient } = require("./twitterClient.js");

// Hugging Face API URL and Key
const HF_API_URL = "https://api-inference.huggingface.co/models/gpt2"; // Example: GPT-2
const HF_API_KEY = process.env.HF_API_KEY; // Your Hugging Face API token

// Function to generate a tweet using Hugging Face
async function generateCavemanTweet(prompt) {
  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt, // Prompt for the model
        parameters: {
          max_length: 50, // Limit the tweet length
          temperature: 0.8, // Control randomness
          top_p: 0.9, // Promote diversity
        },
      },
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
      }
    );

    // Extract and return the generated text
    const generatedText = response.data[0].generated_text;
    return generatedText;
  } catch (error) {
    console.error("Error generating text:", error.response?.data || error.message);
    return "Ugh. Me no think good right now."; // Default text if API fails
  }
}

// Post a caveman tweet
async function postTweet() {
  const cavemanPrompts = [
    "Ugh. Me caveman think about fire and food.",
    "Me wonder why sun go away at night.",
    "Why sky so big? Me curious.",
    "Me need big rock for sitting.",
    "Fire good. Water wet. Me think deep today.",
  ];

  // Pick a random prompt from the array
  const randomPrompt = cavemanPrompts[Math.floor(Math.random() * cavemanPrompts.length)];

  // Generate tweet content from Hugging Face API
  const tweetContent = await generateCavemanTweet(randomPrompt);

  try {
    // Post the tweet to Twitter
    await twitterClient.v2.tweet(tweetContent);
    console.log("Tweeted:", tweetContent);
  } catch (error) {
    console.error("Error posting tweet:", error);
  }
}

// Run the bot
postTweet();
