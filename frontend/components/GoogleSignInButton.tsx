"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
    return (
        <Button onClick={() => signIn("google")} className="w-full">
            Sign in with Google
        </Button>
    );
}
