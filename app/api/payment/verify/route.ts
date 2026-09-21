import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { adminAuth, db } from "@/lib/firebase-admin";
import { getTestProduct } from "@/lib/test-products";

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

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            testId,
        } = body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !testId
        ) {
            return NextResponse.json(
                {
                    error: "Missing payment information",
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
                    error: "Invalid test",
                },
                {
                    status: 400,
                }
            );
        }

        // Get the order created by our server.
        const orderRef = db
            .collection("paymentOrders")
            .doc(razorpay_order_id);

        const orderSnapshot = await orderRef.get();

        if (!orderSnapshot.exists) {
            return NextResponse.json(
                {
                    error: "Payment order not found",
                },
                {
                    status: 404,
                }
            );
        }

        const orderData = orderSnapshot.data();

        if (!orderData) {
            return NextResponse.json(
                {
                    error: "Invalid payment order",
                },
                {
                    status: 400,
                }
            );
        }

        // Make sure this order belongs to this Firebase user.
        if (orderData.userId !== userId) {
            return NextResponse.json(
                {
                    error: "Unauthorized payment order",
                },
                {
                    status: 403,
                }
            );
        }

        // Make sure this is the expected test.
        if (orderData.testId !== testId) {
            return NextResponse.json(
                {
                    error: "Test mismatch",
                },
                {
                    status: 400,
                }
            );
        }

        // Prevent duplicate verification.
        if (orderData.status === "paid") {
            return NextResponse.json({
                success: true,
                alreadyVerified: true,
            });
        }

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET!
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        const isSignatureValid = crypto.timingSafeEqual(
            Buffer.from(generatedSignature),
            Buffer.from(razorpay_signature)
        );

        if (!isSignatureValid) {
            return NextResponse.json(
                {
                    error: "Invalid payment signature",
                },
                {
                    status: 400,
                }
            );
        }

        // Mark order as paid.
        await orderRef.update({
            status: "paid",
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            paidAt: new Date(),
        });

        // Save user's purchase.
        const purchaseId = `${userId}_${testId}`;

        await db
            .collection("purchases")
            .doc(purchaseId)
            .set(
                {
                    userId,
                    testId,
                    testTitle: product.title,
                    amount: product.price,
                    currency: product.currency,
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                    status: "paid",
                    purchasedAt: new Date(),
                },
                {
                    merge: true,
                }
            );

        return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
            testId,
        });
    } catch (error) {
        console.error("Payment verification error:", error);

        return NextResponse.json(
            {
                error: "Payment verification failed",
            },
            {
                status: 500,
            }
        );
    }
}