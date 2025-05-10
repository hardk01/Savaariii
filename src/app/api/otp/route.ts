import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { mobile } = await req.json();

        // Validate mobile number (10 digits, numeric only)
        if (!mobile || !/^\d{10}$/.test(mobile)) {
            return NextResponse.json({ success: false, message: 'Invalid mobile number format' }, { status: 400 });
        }

        const fullMobile = `91${mobile}`;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const authKey = '450913AWnjDWaMi681ddde1P1';
        const TEMPLATE_ID = '681ded23d6fc051829104823';
        const baseURL = 'https://control.msg91.com/api/v5';

        // Send OTP using MSG91
        const response = await fetch(`${baseURL}/otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authkey': authKey,
            },
            body: JSON.stringify({
                template_id: TEMPLATE_ID,
                mobile: fullMobile,
                otp,
                otp_length: 6,
                otp_expiry: 5,
            }),
        });

        const data = await response.json();
        console.log('MSG91 Response:', data);

        if (!response.ok || data.type !== 'success') {
            console.error('MSG91 error:', data);
            return NextResponse.json({ success: false, message: data.message || 'Failed to send OTP' }, { status: 500 });
        }

        // In production, don't send the OTP back to the client
        return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error('Error sending OTP:', error.message);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
