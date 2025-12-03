'use client';

import {useRouter} from 'next/navigation';
import {useSession} from "@/app/session/SessionContext";

export default function Header() {
    const router = useRouter();
    const {currentUser, logout} = useSession();

    const go = (path: string) => router.push(path);

    const handleLogout = () => {
        logout();
        go('/');
    };

    return (
        <div className={"navbar shadow-sm"}>
            <div className={"navbar-start"}>
                <a onClick={() => go('/')}
                   className={"btn btn-ghost text-xl"}>Cinema E-Booking System</a>
            </div>
            <div className={"navbar-center"}>

            </div>
            <div className={"navbar-end gap-x-2"}>
                {currentUser ? (
                    <>
                        <div>Welcome, {currentUser.username}!</div>
                        <button
                            onClick={() => go('/profile/edit')}
                            className="btn"
                            data-testid={"editProfile"}
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={() => go('/portal')}
                            className="btn"
                            id={"portal"}
                        >
                            Portal
                        </button>
                        <button
                            onClick={handleLogout}
                            className="btn"
                            id={"logout"}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => go('/login')}
                        className="btn"
                        id={'login'}
                    >
                        Login
                    </button>
                )}
            </div>

        </div>
    );
}
