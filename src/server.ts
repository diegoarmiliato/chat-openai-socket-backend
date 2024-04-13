import express, { Request, Response } from 'express';
import expressWs from 'express-ws';
import { WebSocket } from 'ws';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';
import setupChatSocket from './websocket';
import documentProcessor from './documentProcessor';
dotenv.config()

const { app } = expressWs(express());
const port = 8080;

app.use(express.json());
app.use(cors())
expressWs(app);

documentProcessor();

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to nlux + Node.js demo server!');
});

setupChatSocket(app);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});