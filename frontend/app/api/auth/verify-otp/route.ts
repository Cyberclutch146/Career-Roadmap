import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });

    const doc = await adminDb.collection('otps').doc(email).get();
    if (!doc.exists) return NextResponse.json({ error: 'No OTP found for this email' }, { status: 400 });

    const data = doc.data()!;
    if (Date.now() > data.expiresAt) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    if (data.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // OTP is valid. Delete it.
    await adminDb.collection('otps').doc(email).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
