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
    setTimeout(() => {
      setOk('An email will be sent if that email exists.');
      setEmail('');
      setBusy(false);
    }, 800);
  }
    
    return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold text-center">Forgot Password</h1>
      <p className="mt-2 text-center text-sm text-gray-600">An email will be sent.</p>

      {msg.err ? (
        <div role="alert" className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {msg.err}
        </div>
      ) : null}

      {msg.ok ? (
        <div role="alert" className="mt-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {msg.ok}
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

