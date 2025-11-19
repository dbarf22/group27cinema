"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {useSession} from '@/app/session/SessionContext';


const PortalPage = () => {
  const [accountType, setAccountType] = useState("");
  const router = useRouter();
  const {currentUser} = useSession();


    useEffect(() => {
        const fetchData = async () => {
            try {
                let key = currentUser?.userKey;
                const response = await fetch(`/api/auth/get-account-type?userKey=${key}`);
                if (!response.ok) {
                    setAccountType("Customer")
                } else {
                    setAccountType("Admin")
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

  const go = (path: string) => {
    console.log(`Navigate to: ${path}`);
    router.push(path);
  };

  if (accountType !== "Admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-700">Welcome to the User Portal</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
        <p className="text-gray-600 mb-8">
          Manage movies, users, promotions, and showtimes from one place.
        </p>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          <div
            onClick={() => go("portal/admin/movies")}
            className="cursor-pointer bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Movies</h2>
            <p className="text-gray-600 text-sm">
              Add, edit, or remove movies and update details.
            </p>
          </div>

          <div
            onClick={() => go("portal/admin/users")}
            className="cursor-pointer bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Users</h2>
            <p className="text-gray-600 text-sm">
              View and manage registered user accounts.
            </p>
          </div>

          <div
            onClick={() => go("portal/admin/promotions")}
            className="cursor-pointer bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Promotions</h2>
            <p className="text-gray-600 text-sm">
              Create or update promotional offers and discounts.
            </p>
          </div>

          <div
            onClick={() => go("portal/admin/manage-showtimes")}
            className="cursor-pointer bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Showtimes</h2>
            <p className="text-gray-600 text-sm">
              Schedule new showtimes and update existing ones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalPage;
