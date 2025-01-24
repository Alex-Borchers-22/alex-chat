import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// This is a placeholder for your actual system prompt
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT;

// Add this interface at the top of the file
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    console.log(messages);

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: messages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    if (response.content[0].type === 'text') {
      return NextResponse.json({ response: response.content[0].text });
    }
    return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from Claude' },
      { status: 500 }
    );
  }
} 