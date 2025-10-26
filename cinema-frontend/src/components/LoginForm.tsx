"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        try {
            const f = new FormData(e.currentTarget);
            const email = String(f.get("email") || "").trim();
            const password = String(f.get("password") || "");

            if (!email || !password) {
                setError("Please enter your email and password.");
                return;
            }

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Login failed");
            }

            router.push("/");

        } catch (err: any) {
            setError(err.message || "Incorrect login info.");
        }
    }

  return (
    <div className="mx-auto mt-14 px-4 max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
        <h1 className="text-3xl text-center tracking-wide">Log In</h1>
        <p className="mt-1 text-center text-sm text-gray-600">
          Enter your credentials to manage your bookings
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 text-sm text-red-700 bg-red-50 p-2 rounded border border-red-200"
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-black px-4 py-2.5 font-semibold text-white hover:bg-neutral-900 transition"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-700 text-center">
          Don’t have an account?
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="ml-1 hover:underline font-medium"
          >
            Sign up here
          </button>
        </div>
      </div>
    </div>
  );
}
