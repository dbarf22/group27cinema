'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: string; err: string }>({ ok: '', err: '' });

  const setErr = (t: string) => setMsg({ ok: '', err: t });
  const setOk = (t: string) => setMsg({ ok: t, err: '' });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg({ ok: '', err: '' });

    const val = email.trim();
    if (!val || !isEmail(val)) {
      setErr('Enter a valid email.');
      return;
    }

    setBusy(true);
    try {
        const res = await fetch(`http://localhost:8080/api/auth/forgot-password?email=${email}`, {
            method: 'POST',
            headers: {
                  "Content-Type": "application/json",
              },
            body: JSON.stringify({email: email})
        });
        setOk("If an account with that email exists, an email will be sent.")
    } catch (error) {
        setOk("If an account with that email exists, an email will be sent.")
    } finally {
        setBusy(false);
    }


  }
    
    return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold text-center">Forgot Password</h1>
      <p className="mt-2 text-center text-sm text-gray-600">An email will be sent.</p>

      {msg.err ? (
          <div
              role="alert"
              className="mt-4 alert alert-error"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{msg.err}</span>
          </div>
      ) : null}

      {msg.ok ? (
          <div role="alert" className="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{msg.ok}</span>
          </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            autoComplete="email"
            required
            onChange={e => setEmail(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="user@uga.edu"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {busy ? 'Sending…' : 'Send email'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button type="button" onClick={() => router.push('/login')} className="text-sm underline">
          Back
        </button>
      </div>
    </div>
  );
}

