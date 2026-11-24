"use client";

import { signInWithGoogle, signOut } from "../firebase/firebase";
import {Fragment} from "react";
import styles from "./sign-in.module.css";
import { User } from "firebase/auth";

interface SignInProps {
    user: User | null;
}

export default function SignIn({ user }: SignInProps) {
    return (
        <Fragment>
            {
                user ? 
                (
                    <button className={styles.signIn} onClick={signOut}>
                        Sign Out
                    </button>) 
                : 
                (
                    <button className={styles.signIn} onClick={signInWithGoogle}>
                        Sign In with Google
                    </button>
                )
            }
        </Fragment>
    )
}