"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/session/SessionContext";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser, isLoading } = useSession();

  useEffect(() => {
    // redirects to login page for all portal routes
    if (!isLoading && !currentUser) {
      router.replace("/login");
    }
  }, [isLoading, currentUser, router]);

  // makes sure it doesn't prematurely render screen before checking session
  if (isLoading || !currentUser) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return <>{children}</>;
}
