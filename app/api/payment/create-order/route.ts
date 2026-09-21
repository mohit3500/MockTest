import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

import { adminAuth, db } from "@/lib/firebase-admin";
import { getTestProduct } from "@/lib/test-products";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    try {
        const authorization =
            request.headers.get("authorization");

        if (!authorization?.startsWith("Bearer ")) {
            return NextResponse.json(
                {
                    error: "Authentication required",
                },
                {
                    status: 401,
                }
            );
        }

        const idToken = authorization.substring(7);

        const decodedToken =
            await adminAuth.verifyIdToken(idToken);

        const userId = decodedToken.uid;

        const body = await request.json();

        const testId = body.testId;

        if (!testId || typeof testId !== "string") {
            return NextResponse.json(
                {
                    error: "Invalid test ID",
                },
                {
                    status: 400,
                }
            );
        }

        const product = getTestProduct(testId);

        if (!product) {
            return NextResponse.json(
                {
                    error: "Test is not available for purchase",
                },
                {
                    status: 404,
                }
            );
        }

        // Check if user already purchased this test
        const existingPurchase = await db
            .collection("purchases")
            .where("userId", "==", userId)
            .where("testId", "==", testId)
            .where("status", "==", "paid")
            .limit(1)
            .get();

        if (!existingPurchase.empty) {
            return NextResponse.json({
                alreadyPurchased: true,
                message: "Test already purchased",
            });
        }

        // Razorpay amount is in paise.
        const amountInPaise = product.price * 100;

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: product.currency,
            receipt: `test_${testId}_${Date.now()}`,
            notes: {
                userId,
                testId,
                testTitle: product.title,
            },
        });

        // Store pending order
        await db.collection("paymentOrders").doc(order.id).set({
            orderId: order.id,
            userId,
            testId,
            amount: amountInPaise,
            currency: product.currency,
            status: "created",
            createdAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: amountInPaise,
            currency: product.currency,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            testId,
        });
    } catch (error) {
        console.error("Create Razorpay order error:", error);

        return NextResponse.json(
            {
                error: "Unable to create payment order",
            },
            {
                status: 500,
            }
        );
    }
}