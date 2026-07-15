import { searchChatbot } from '@/lib/search';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await searchChatbot(query);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', type: 'text', text: 'I encountered an error while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}
