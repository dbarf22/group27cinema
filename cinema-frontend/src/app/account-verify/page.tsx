"use client";
import 'react-phone-number-input/style.css'
import SignupForm from "@/components/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="mx-auto mt-14 px-4 max-w-md">
      <div className="card bg-base-100 p-8">
        <h1 className="text-3xl text-center tracking-wide">Verify Your Account</h1>
        <p className="mt-1 text-center text-sm ">
          Check your email for a verification link.
        </p>
          <p className="mt-1 text-center text-sm ">
              <Link href="/" className="underline text-info">
                Go home
              </Link>
          </p>
      </div>
    </div>
  );
}