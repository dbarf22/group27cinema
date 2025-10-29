'use client';

import {createContext, useContext, useState, ReactNode, useEffect} from "react";

type User = {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phoneNumber: string;
    wantsPromotions: boolean;
}

type SessionContextInfo = {
    currentUser: User | null;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
};

const SessionContext = createContext<SessionContextInfo | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            localStorage.removeItem('currentUser');
        }
        setIsLoading(false);
    }, []);

    const login = (user: User) => {
        setCurrentUser(user);
        try {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } catch (e) {
            console.error("Failed to save user to localStorage", e);
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const value = { currentUser, isLoading, login, logout };

    if (isLoading) {
        return null;
    }

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}