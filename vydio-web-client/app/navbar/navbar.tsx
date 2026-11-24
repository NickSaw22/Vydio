"use client";

import { useEffect } from "react";
import { onAuthStateChangedListener } from "../firebase/firebase";
import Image from "next/image";
import Link from "next/link";
import SignIn from "./sign-in";
import { useState } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/vydio-file.svg" alt="Vydio Logo" width={32} height={32} />
          <span>Vydio</span>
        </Link>
      </div>
      <ul className="flex space-x-4 text-sm font-medium">
        {/* <li>
          <a href="/" className="hover:underline">
            Home
          </a>
        </li> */}
        <li>
          <a href="/watch" className="hover:underline">
            Watch
          </a>
        </li>
      </ul>
      {user && <Upload />}
      &nbsp;&nbsp;
      <SignIn user={user} />
    </nav>
  );
}