import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function GET() {
    try {
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Razorpay environment variables missing",
                },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const order = await razorpay.orders.create({
            amount: 9900,
            currency: "INR",
            receipt: `debug_${Date.now()}`,
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error: any) {
        console.error("Razorpay production test failed:", error);

        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Razorpay request failed",
                code: error?.code || null,
                statusCode: error?.statusCode || null,
            },
            { status: 500 }
        );
    }
}