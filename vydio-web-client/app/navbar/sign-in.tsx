"use client";

import { signInWithGoogle, signOut } from "../firebase/firebase";
import type { User } from "firebase/auth";

interface SignInProps {
    user: User | null;
}

export default function SignIn({ user }: SignInProps) {
    return (
        <button
            className="inline-flex min-h-9 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={user ? signOut : signInWithGoogle}
        >
            {user ? "Sign out" : "Sign in"}
        </button>
    )
}