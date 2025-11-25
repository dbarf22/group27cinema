'use client';

import {createContext, useContext, useState, ReactNode, useEffect} from "react";

type User = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  wantsPromotions: boolean;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  cards: Card[];
  accountType: string; // Add this line
};

type Card = {
    cardType: string;
    cardNumber: string;
    expMonth: string;
    expYear: string;
    billingStreet: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
};

type SessionContextInfo = {
    currentUser: User | null;
    isLoading: boolean;
    login: (user: User, rememberMe?: boolean) => void;
    logout: () => void;
};

const SessionContext = createContext<SessionContextInfo | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
        }
        setIsLoading(false);
    }, []);

    const login = (user: User, rememberMe: boolean = false) => {
        setCurrentUser(user);
        try {
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('currentUser', JSON.stringify(user));
        } catch (e) {
            console.error("Failed to save user to storage", e);
        }
    };

    const logout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem("currentUser");
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