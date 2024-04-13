import type OpenAI from 'openai';
import { WebSocket } from 'ws';
import openaiClient from './openaiClient';

let conversationHistory: OpenAI.Chat.ChatCompletionCreateParams | any = [];

 function setupChatSocket(app: any) {
    app.ws('/chatSocket', async (socket: WebSocket, req: any) => {
        socket.on('message', async (message: string) => {
            conversationHistory.push({ role: 'user', content: `Em poucas palavras, ${message}` });
            const stream = await openaiClient.chat.completions.create({
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
        });
    });
}
 export default setupChatSocket;