import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET() {
    try {
        const testRef = db
            .collection("paymentDebug")
            .doc("vercel-test");

        await testRef.set({
            message: "Vercel Firestore test",
            createdAt: new Date(),
        });

        const snapshot = await testRef.get();

        return NextResponse.json({
            success: true,
            exists: snapshot.exists,
            data: snapshot.data(),
        });
    } catch (error: any) {
        console.error("Firestore test error:", error);

        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Firestore failed",
                code: error?.code || null,
            },
            { status: 500 }
        );
    }
}