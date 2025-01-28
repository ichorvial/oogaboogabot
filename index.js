import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// Function to generate a "caveman" themed tweet
const generateCavemanPost = async () => {
    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/gpt2',  // GPT-2 model for text generation
            {
                inputs: 'Write a short tweet in simple, broken caveman language about dinosaurs, survival, or nature. Example: "Me see big dino, me run fast!" ' +
                        'Make sure the tweet is no longer than 150 characters.'
 
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Hugging Face API key
                }
            }
        );

        // Get the generated text (with caveman-like theme)
        const generatedText = response.data[0]?.generated_text || 'Ugghh... me no tweet!';
        console.log('Generated text from Hugging Face:', generatedText);  // Debugging
        return generatedText;
    } catch (error) {
        console.error('Error generating text:', error);
        return 'Ugghh... me no tweet!';
    }
};

const handleTweet = async () => {
    // Generate tweet using caveman theme
    const postText = await generateCavemanPost();

    // Twitter client setup
    const twitterClient = new TwitterApi({
        appKey: process.env.CONSUMER_KEY ?? '',
        appSecret: process.env.CONSUMER_SECRET ?? '',
        accessToken: process.env.ACCESS_TOKEN ?? '',
        accessSecret: process.env.ACCESS_TOKEN_SECRET ?? '',
    });

    const tweetClient = twitterClient.readWrite;

    try {
        // Try sending the tweet
        console.log('Tweet text to be sent:', postText);  // Debugging
        await tweetClient.v2.tweet(postText);
        console.log('Tweet sent successfully!');
    } catch (error) {
        if (error.code === 429) {
            console.log('Rate limit exceeded. Retrying...');
            // Handle rate limit by retrying after a certain time
            const resetTime = error.response.headers['x-rate-limit-reset'];
            const delay = resetTime * 1000 - Date.now() + 5000;  // Adding a buffer
            setTimeout(() => {
                handleTweet();  // Retry the tweet after the wait
            }, delay);
        } else {
            console.error('Error sending tweet:', error);
        }
    }
};

// Run the tweet function directly
handleTweet();
