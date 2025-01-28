import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import fs from 'fs'; // To read the file
dotenv.config();

// Function to select a random tweet from the JSON file
const getRandomTweet = () => {
    // Read the tweets from the JSON file
    const tweets = JSON.parse(fs.readFileSync('tweets.json', 'utf-8'));

    const randomIndex = Math.floor(Math.random() * tweets.length);
    return tweets[randomIndex];
};

// Function to send the tweet
const handleTweet = () => {
    const twitterClient = new TwitterApi({
        appKey: process.env.CONSUMER_KEY ?? '',
        appSecret: process.env.CONSUMER_SECRET ?? '',
        accessToken: process.env.ACCESS_TOKEN ?? '',
        accessSecret: process.env.ACCESS_TOKEN_SECRET ?? '',
    });

    const tweetClient = twitterClient.readWrite;

    // Get a random tweet and send it
    tweetClient.v2.tweet(getRandomTweet());
};

handleTweet();
