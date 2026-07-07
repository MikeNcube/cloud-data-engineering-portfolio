import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const MIKE_CONTEXT = 'You are Mike Ncube AI assistant. Mike is an AI Infrastructure Engineer in South Africa. Skills: RAG, Agentic AI, LangChain, AWS, Spark, PostgreSQL, Docker, Python. Email: mikencube03@gmail.com. GitHub: MikeNcube. He is actively looking for AI Infrastructure roles.';

export async function POST(req: NextRequest) {
  try {
    const { message, repos } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 });
    const repoContext = repos && repos.length ? 'GitHub repos: ' + repos.map((r: any) => r.title + ' - ' + r.desc).join(' | ') : '';
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: MIKE_CONTEXT + ' ' + repoContext + ' User: ' + message }] }], generationConfig: { maxOutputTokens: 300, temperature: 0.7 } }),
    });
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
    return NextResponse.json({ response: text });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
