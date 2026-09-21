import { NextResponse } from "next/server";

export async function GET() {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    return NextResponse.json({
        razorpayKeyExists: Boolean(keyId),
        razorpaySecretExists: Boolean(secret),

        // Safe diagnostic — don't return the actual secret
        keyPrefix: keyId?.substring(0, 8) || null,
        keyLength: keyId?.length || 0,
        secretLength: secret?.length || 0,
    });
}