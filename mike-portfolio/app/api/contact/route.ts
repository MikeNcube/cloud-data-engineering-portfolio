import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    await resend.emails.send({ from: 'Portfolio <onboarding@resend.dev>', to: 'mikencube03@gmail.com', subject: 'New message from ' + name, html: '<p><b>Name:</b> ' + name + '</p><p><b>Email:</b> ' + email + '</p><p><b>Message:</b> ' + message + '</p>' });
    return NextResponse.json({ success: true });
  } catch(e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
