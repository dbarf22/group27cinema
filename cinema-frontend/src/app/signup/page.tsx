'use client';

import SignupForm from '@/components/SignupForm';
import {useEffect, useState} from "react";
import {useSession} from "@/app/session/SessionContext";
import {useRouter} from "next/navigation";

export default function SignupPage() {

    const [isAuthorized, setIsAuthorized] = useState(false);
    const {currentUser} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!currentUser) {
            setIsAuthorized(true);
        } else {
            router.push('/')
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
    <div className="max-w-4xl mx-auto p-6">
      <SignupForm />
    </div>
  );
}
