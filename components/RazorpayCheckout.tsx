"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

import { auth } from "@/lib/firebase";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayCheckoutProps {
    testId: string;
    testTitle: string;
    price: number;
    onSuccess?: () => void;
}

export default function RazorpayCheckout({
    testId,
    testTitle,
    price,
    onSuccess,
}: RazorpayCheckoutProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const existingScript =
            document.querySelector(
                'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
            );

        if (existingScript) {
            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        document.body.appendChild(script);
    }, []);

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError("");

            const user = auth.currentUser;

            if (!user) {
                setError("Please login before purchasing.");
                setLoading(false);
                return;
            }

            const idToken = await user.getIdToken();

            const orderResponse = await fetch(
                "/api/payment/create-order",
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

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(
                    orderData.error ||
                    "Unable to create payment order."
                );
            }

            if (orderData.alreadyPurchased) {
                onSuccess?.();
                return;
            }

            if (!window.Razorpay) {
                throw new Error(
                    "Razorpay Checkout could not be loaded."
                );
            }

            const options = {
                key: orderData.keyId,

                amount: orderData.amount,

                currency: orderData.currency,

                name: "MockTest",

                description: `Unlock ${testTitle}`,

                order_id: orderData.orderId,

                prefill: {
                    name: user.displayName || "",
                    email: user.email || "",
                },

                theme: {
                    color: "#5b4bdb",
                },

                handler: async function (response: any) {
                    try {
                        const verifyToken =
                            await auth.currentUser?.getIdToken();

                        if (!verifyToken) {
                            throw new Error(
                                "Authentication expired."
                            );
                        }

                        const verifyResponse =
                            await fetch(
                                "/api/payment/verify",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                        Authorization: `Bearer ${verifyToken}`,
                                    },
                                    body: JSON.stringify({
                                        razorpay_order_id:
                                            response.razorpay_order_id,

                                        razorpay_payment_id:
                                            response.razorpay_payment_id,

                                        razorpay_signature:
                                            response.razorpay_signature,

                                        testId,
                                    }),
                                }
                            );

                        const verifyData =
                            await verifyResponse.json();

                        if (!verifyResponse.ok) {
                            throw new Error(
                                verifyData.error ||
                                "Payment verification failed."
                            );
                        }

                        if (verifyData.success) {
                            onSuccess?.();
                        }
                    } catch (error) {
                        console.error(error);

                        setError(
                            error instanceof Error
                                ? error.message
                                : "Payment verification failed."
                        );
                    } finally {
                        setLoading(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on(
                "payment.failed",
                function (response: any) {
                    console.error(
                        "Razorpay payment failed:",
                        response
                    );

                    setError(
                        response?.error?.description ||
                        "Payment failed. Please try again."
                    );

                    setLoading(false);
                }
            );

            razorpay.open();
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to start payment."
            );

            setLoading(false);
        }
    };

    return (
        <div>
            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b4bdb] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#4939c5] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock className="h-4 w-4" />
                        Unlock for ₹{price}
                    </>
                )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#697386]">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Secure payment powered by Razorpay
            </div>
        </div>
    );
}