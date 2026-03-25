import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const { latitude, longitude } = await request.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      return NextResponse.json(
        { error: 'Twilio credentials not configured' },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);

    const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    const message = `🚨 SOS ALERT! 🚨\n\nI am in danger and need immediate help!\n\n📍 My current location:\n${locationLink}\n\nPlease respond immediately!`;

    const twilioMessage = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+917010029891',
      body: message,
    });

    return NextResponse.json({
      success: true,
      messageSid: twilioMessage.sid,
    });
  } catch (error) {
    console.error('Error sending SOS:', error);
    return NextResponse.json(
      { error: 'Failed to send SOS message' },
      { status: 500 }
    );
  }
}
