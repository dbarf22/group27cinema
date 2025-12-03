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
      <div className="min-h-screen flex items-center justify-center">
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
        <p className="mb-8">
          Manage movies, users, promotions, and showtimes from one place.
        </p>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          <div
            onClick={() => go("portal/admin/movies")}
            className="card cursor-pointer bg-base-100 border-base-300 border shadow-md p-6 hover:shadow-lg
            hover:bg-base-300 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Manage Movies</h2>
            <p className="text-sm">
              Add new movies.
            </p>
          </div>

          <div
            onClick={() => go("portal/admin/promotions")}
            className="card cursor-pointer bg-base-100 border-base-300 border shadow-md p-6
            hover:shadow-lg hover:bg-base-300 transition"
          >
            <h2 className="text-xl font-semibold  mb-2">Manage Promotions</h2>
            <p className="text-sm">
              Create or update promotional offers and discounts.
            </p>
          </div>

          <div
            onClick={() => go("portal/admin/manage-showtimes")}
            className="card cursor-pointer bg-base-100 border-base-300 border shadow-md p-6 hover:shadow-lg
            hover:bg-base-300 transition"
          >
            <h2 className="text-xl font-semibold  mb-2">Manage Showtimes</h2>
            <p className="text-sm">
              Schedule new showtimes and update existing ones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalPage;
