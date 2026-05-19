import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Firestore with 10 min expiry
    await adminDb.collection('otps').doc(email).set({
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      createdAt: Date.now()
    });

    let transporter;
    
    // Check if real SMTP credentials are provided, else fallback to ethereal test account
    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      console.log('No SMTP credentials found in .env, generating Ethereal test account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const info = await transporter.sendMail({
      from: '"RoadmapAI" <noreply@roadmapai.com>',
      to: email,
      subject: 'Your Login OTP',
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
      html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
    });

    console.log('Message sent: %s', info.messageId);
    
    // If using ethereal, log the preview URL
    if (info.messageId && !process.env.SMTP_HOST) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
