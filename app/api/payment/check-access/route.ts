import { NextRequest, NextResponse } from "next/server";

import { adminAuth, db } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
    try {
        const authorization =
            request.headers.get("authorization");

        if (!authorization?.startsWith("Bearer ")) {
            return NextResponse.json({
                authenticated: false,
                hasAccess: false,
            });
        }

        const idToken = authorization.substring(7);

        const decodedToken =
            await adminAuth.verifyIdToken(idToken);

        const userId = decodedToken.uid;

        const body = await request.json();

        const testId = body.testId;

        if (!testId) {
            return NextResponse.json(
                {
                    error: "Test ID required",
                },
                {
                    status: 400,
                }
            );
        }

        const purchaseId = `${userId}_${testId}`;

        const purchase = await db
            .collection("purchases")
            .doc(purchaseId)
            .get();

        const hasAccess =
            purchase.exists &&
            purchase.data()?.status === "paid";

        return NextResponse.json({
            authenticated: true,
            hasAccess,
        });
    } catch (error) {
        console.error("Access check error:", error);

        return NextResponse.json(
            {
                authenticated: false,
                hasAccess: false,
            },
            {
                status: 401,
            }
        );
    }
}