"use client";

import {useState, FormEvent} from "react";
import {useRouter} from "next/navigation";
import {useSession} from "@/app/session/SessionContext";

export default function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const {login} = useSession();

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        try {
            const f = new FormData(e.currentTarget);
            const email = String(f.get("email") || "").trim();
            const password = String(f.get("password") || "");
            const rememberMe = f.get("rememberMe") === "on";

            if (!email || !password) {
                setError("Please enter your email and password.");
                return;
            }

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            }); // responds with

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Login failed");
            }

            const data = await res.json();
            login(data.user, rememberMe);

            router.push("/");

        } catch (err: any) {
            setError(err.message || "Incorrect login info.");
        }
    }

    return (
        <div className="card bg-base-100 card-border card-xl">
            <div className="card-body">
                <h2 className="card-title justify-center text-center">Log In</h2>
                <p className={"text-sm justify-center text-center"}>Enter your credentials to manage your bookings</p>

                {error && (
                    <div
                        role="alert"
                        className="mt-4 alert alert-error"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={onSubmit} className="mt-6 space-y-5 justify-center text-center">
                    <div>
                        <label className={"input"}>
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </g>
                            </svg>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                autoComplete="email"
                                required
                            />
                        </label>
                    </div>

                    <div>
                        <label className={"input"}>
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                    ></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                required
                            />
                        </label>
                    </div>

                    <div className="flex items-center justify-between text-sm ">
                        <label className="flex items-center gap-2">
                            <input
                                id="rememberMe"
                                type="checkbox"
                                name="rememberMe"
                                className="checkbox"
                            />
                            Remember me
                        </label>
                        <button
                            type={"button"}
                            onClick={() => router.push("/forgot-password")}
                            className="btn"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-wide"
                        data-testid={"loginFormSubmit"}
                    >
                        Log In
                    </button>
                </form>

                <div className="text-sm text-center mt-5">
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
