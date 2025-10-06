// components/AuthGuard.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard() {
    const router = useRouter();

    useEffect(() => {
        const cookie = document.cookie.includes("fluxelio");
        if (!cookie) {
            // No cookie in the browser
            router.replace("/login");
        }
    }, []);

    return null; // This component just does the redirect
}
