import express, { Request, Response } from 'express';
import expressWs from 'express-ws';
import { WebSocket } from 'ws';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()

const { app } = expressWs(express());
const port = 8080;

app.use(express.json());
app.use(cors())
expressWs(app);

const openai = new OpenAI({
    apiKey: process.env['API_KEY'], // This is the default and can be omitted
  });

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to nlux + Node.js demo server!');
});

interface Message {
    message: string;
}

let conversationHistory: OpenAI.Chat.ChatCompletionCreateParams | any = [];

app.ws('/chatSocket', async (socket: WebSocket, req: Request) => {
    socket.on('message', async (message: string ) => {
        conversationHistory.push({ role: 'user', content: `Em poucas palavras, ${message}` });
        const stream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: conversationHistory,
            stream: true
        });
        let response = '';
        for await (const chunk of stream) {
            response += chunk.choices[0]?.delta?.content || '';
            socket.send(chunk.choices[0]?.delta?.content || '');
        }
        conversationHistory.push({ role: 'assistant', content: response });
        socket.close();
        // Add your code here
    });
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});