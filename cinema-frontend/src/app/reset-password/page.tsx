'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
  const router = useRouter();
  const sp = useSearchParams();

  const token = sp.get('token') ?? '';
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: string; err: string }>({ ok: '', err: '' });

  const setErr = (s: string) => setMsg({ ok: '', err: s });
  const setOk = (s: string) => setMsg({ ok: s, err: '' });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg({ ok: '', err: '' });

    if (!token) {
      setErr('Invalid or expired link.');
      return;
    }
    if (!newPw || !confirmPw) {
      setErr('Please fill in all fields.');
      return;
    }
    if (newPw.length < 6) {
      setErr('Password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setErr('Passwords do not match.');
      return;
    }
      setBusy(true);
      try {
          const res = await fetch(`http://localhost:8080/api/auth/reset-password?token=${token}`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({newPassword: newPw}),
          });

          if (!res.ok) {
              const errText = await res.text();
              throw new Error(errText || "Invalid token.");
          }

          setOk("Password reset successfully.");
          setTimeout(() => router.push("/login"));
      } catch (err: any) {
          setErr(err.message);
      } finally {
          setBusy(false);
      }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold text-center">Reset Password</h1>
      <p className="mt-2 text-center text-sm text-gray-600">Enter your new password.</p>

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

      {token && !msg.ok ? (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="newPw" className="text-sm">New password</label>
            <input
              id="newPw"
              type="password"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              autoComplete="new-password"
              required
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="******"
            />
          </div>
          <div>
            <label htmlFor="confirmPw" className="text-sm">Confirm password</label>
            <input
              id="confirmPw"
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              autoComplete="new-password"
              required
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="******"
            />
          </div>
          <button type="submit" disabled={busy} className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50">
            {busy ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
      ) : null}

      {!token && !msg.ok ? (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Invalid or expired link.
        </div>
      ) : null}

      <div className="mt-6 text-center">
        <button type="button" onClick={() => router.push('/login')} className="text-sm underline">
          Back
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md p-6 text-center">
          <div className="rounded border p-6">Loading</div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
