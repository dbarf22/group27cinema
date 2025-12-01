'use client';

import { useRouter } from 'next/navigation';
import { useSession } from "@/app/session/SessionContext";

export default function Header() {
  const router = useRouter();
  const { currentUser, logout } = useSession();

  const go = (path: string) => router.push(path);

  const handleLogout = () => {
    logout();
    go('/');
  };

  return (
    <header className="w-full bg-blue-600 text-white shadow-md py-4 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <h1
          onClick={() => go('/')}
          className="text-2xl font-bold tracking-tight cursor-pointer hover:underline"
        >
          Cinema E-Booking System
        </h1>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <span className="text-sm">Welcome, {currentUser.username}!</span>

              <button
                onClick={() => go('/profile/edit')}
                className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
                data-testid={"editProfile"}
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
                id={"logout"}
              >
                Logout
              </button>
              <button
                onClick={() => go('/portal')}
                className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
                id={"portal"}
              >
                Portal
              </button>
            </>
          ) : (
            <button
              onClick={() => go('/login')}
              className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
              id={'login'}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
