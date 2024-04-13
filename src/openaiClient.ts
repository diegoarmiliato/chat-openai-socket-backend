import OpenAI from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

const openaiClient = new OpenAI({
    apiKey: process.env['API_KEY'], // This is the default and can be omitted
});

export default openaiClient;