"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/session/SessionContext";

type AdminStatus = "checking" | "authorized" | "unauthorized";

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser, isLoading } = useSession();
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("checking");

  useEffect(() => {
    if (isLoading) return;

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    const checkAdmin = async () => {
      try {
        const res = await fetch(
          `/api/auth/get-account-type?userKey=${encodeURIComponent(
            currentUser.userKey
          )}`
        );

      if (res.ok) {
          // 200 =admin
          setAdminStatus("authorized");
        } else {
          // 403 = not admin
          setAdminStatus("unauthorized");
        }
      } catch (e) {
        console.error("Failed to check admin status", e);
        setAdminStatus("unauthorized");
      }
    };

    checkAdmin();
  }, [currentUser, isLoading, router]);

  if (isLoading || adminStatus === "checking") {
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (adminStatus === "unauthorized") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            You are not authorized to view this page.
          </h1>
          <p className="text-gray-600 mb-4">
            This section is only available to administrators.
          </p>
          <a
            href="/"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            ← Return to Home
          </a>
        </div>
      </div>
    );
  }

  // Logged in + admin
  return <>{children}</>;
}
