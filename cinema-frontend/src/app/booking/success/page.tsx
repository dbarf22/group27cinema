"use client";
import 'react-phone-number-input/style.css'
import SignupForm from "@/components/SignupForm";
import Link from "next/link";
import {useSession} from '@/app/session/SessionContext';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from "react";


export default function SignupPage() {
    const {currentUser} = useSession();
    const router = useRouter();

    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setIsAuthorized(true);
        }
    }, [currentUser, router])

    if (!isAuthorized) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-14 px-4 max-w-md">
            <div className="card card-border items-center text-center border-base-300 shadow-lg bg-base-100 p-8">
                <h1 className="card-title font-bold text-3xl">Enjoy!</h1>
                <p className="mt-2 text-center text-sm ">
                    Check your email for a receipt.
                </p>
                <p className="mt-2 text-center text-sm ">
                    <Link href="/" className="underline text-info-content">
                        Go home
                    </Link>
                </p>
            </div>
        </div>
    );
}