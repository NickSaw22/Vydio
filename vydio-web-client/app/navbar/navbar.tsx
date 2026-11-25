"use client";

import { useEffect, useState } from "react";
import { onAuthStateChangedListener } from "../firebase/firebase";
import Image from "next/image";
import Link from "next/link";
import SignIn from "./sign-in";
import type { User } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-zinc-900 no-underline" aria-label="Vydio home">
          <Image src="/vydio-file.svg" alt="" width={34} height={34} priority />
          <span>vydio</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium text-slate-600 no-underline transition-colors hover:text-blue-700">
            Explore
          </Link>
          <SignIn user={user} />
        </div>
      </nav>
    </header>
  );
}