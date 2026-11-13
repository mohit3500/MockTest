"use client";

import { useCallback, useEffect, useState } from "react";


export function useTestAccess(testId: string) {
    const [hasAccess, setHasAccess] = useState(false);
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const checkAccess = useCallback(async () => {
        try {
            setChecking(true);

            setAuthenticated(true);


            const response = await fetch(
                "/api/payment/check-access",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
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


    return {
        hasAccess,
        authenticated,
        checking,
        refreshAccess: checkAccess,
    };
}