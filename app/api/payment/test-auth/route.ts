import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
    try {
        const authorization =
            request.headers.get("authorization");

        if (!authorization?.startsWith("Bearer ")) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing Bearer token",
                },
                { status: 401 }
            );
        }

        const token = authorization.substring(7);

        const decodedToken =
            await adminAuth.verifyIdToken(token);

        return NextResponse.json({
            success: true,
            uid: decodedToken.uid,
            email: decodedToken.email || null,
        });
    } catch (error: any) {
        console.error("Firebase token test error:", error);

        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Token verification failed",
                code: error?.code || null,
            },
            { status: 500 }
        );
    }
}