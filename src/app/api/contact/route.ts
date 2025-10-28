import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createEmailHTML(name: string, email: string, subject: string, message: string, service: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; color: #111827; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { font-size: 24px; margin-bottom: 8px; color: #047857; }
          .field { margin: 8px 0; }
          .label { font-weight: 600; color: #374151; }
          .message-box { margin-top: 16px; padding: 16px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; }
          .message-text { white-space: pre-wrap; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Contact Message</h1>
          <div class="field">
            <span class="label">Name:</span> ${name}
          </div>
          <div class="field">
            <span class="label">Email:</span> ${email}
          </div>
          <div class="field">
            <span class="label">Service:</span> ${service}
          </div>
          ${subject ? `<div class="field"><span class="label">Subject:</span> ${subject}</div>` : ''}
          <div class="message-box">
            <div class="message-text">${message}</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, service } = body || {};

    if (!name || !email || !message || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await connectDB();

    const saved = await ContactMessage.create({ name, email, subject, message, service });

    // Send email notification
    const toAddress = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_TO_EMAIL;
    if (!toAddress) {
      console.warn('CONTACT_TO_EMAIL not configured');
    } else {
      try {
        await resend.emails.send({
          from: process.env.CONTACT_FROM_EMAIL || 'Bangladesh Election Insights <onboarding@resend.dev>',
          to: [toAddress],
          subject: `New contact message${subject ? `: ${subject}` : ''}`,
          html: createEmailHTML(name, email, subject || '', message, service),
        });
      } catch (emailErr) {
        console.error('Error sending email:', emailErr);
        // Don't fail the entire request if email fails
      }
    }

    return NextResponse.json({ success: true, id: saved._id });
  } catch (err) {
    console.error('Contact POST error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



