import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['API_KEY'], // This is the default and can be omitted
});

async function main() {
    const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Say this is a test' }],
        stream: true,
    });
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
}

main();