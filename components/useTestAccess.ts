"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";

export function useTestAccess(testId: string) {
    const [hasAccess, setHasAccess] = useState(false);
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const checkAccess = useCallback(async () => {
        try {
            setChecking(true);

            const user = auth.currentUser;

            if (!user) {
                setAuthenticated(false);
                setHasAccess(false);
                return;
            }

            setAuthenticated(true);

            const idToken = await user.getIdToken();

            const response = await fetch(
                "/api/payment/check-access",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                        testId,
                    }),
                }
            );

            const data = await response.json();

            setHasAccess(data.hasAccess === true);
        } catch (error) {
            console.error("Access check failed:", error);

            setHasAccess(false);
        } finally {
            setChecking(false);
        }
    }, [testId]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (user) => {
                if (!user) {
                    setAuthenticated(false);
                    setHasAccess(false);
                    setChecking(false);
                    return;
                }

                await checkAccess();
            }
        );

        return () => unsubscribe();
    }, [checkAccess]);

    return {
        hasAccess,
        authenticated,
        checking,
        refreshAccess: checkAccess,
    };
}