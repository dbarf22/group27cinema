'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <header className="w-full bg-blue-600 text-white shadow-md py-4 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <h1
          onClick={handleHomeClick}
          className="text-2xl font-bold tracking-tight cursor-pointer hover:underline"
        >
          Cinema E-Booking System
        </h1>

        <button
          onClick={handleLoginClick}
          className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Login
        </button>
      </div>
    </header>
  );
}
