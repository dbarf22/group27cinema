'use client';

import LoginForm from '@/components/LoginForm';
import {useSession} from "@/app/session/SessionContext";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function LoginPage() {
    const { currentUser } = useSession();
    const router = useRouter();

    const [isAuthorized, setIsAuthorized] = useState(false);

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
    <div className="max-w-md mx-auto p-6">
      <LoginForm />
    </div>
  );
}