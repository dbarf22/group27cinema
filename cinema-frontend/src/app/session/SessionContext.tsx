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
    userKey: string;
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
    cardholder: string;
    cvv: string;
};

type SessionContextInfo = {
    currentUser: User | null;
    isLoading: boolean;
    login: (user: User, rememberMe: boolean) => void;
    logout: () => void;
    isRemembered: boolean;
};

const SessionContext = createContext<SessionContextInfo | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRemembered, setIsRemembered] = useState(false);

    useEffect(() => {
        try {
            const storedUserInLocal = localStorage.getItem('currentUser');
            const storedUserInSession = sessionStorage.getItem('currentUser');

            let storedUser = storedUserInLocal || storedUserInSession;
            let remembered = Boolean(storedUserInLocal);

            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
                setIsRemembered(remembered);
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
        }
        setIsLoading(false);
    }, []);

    const login = (user: User, rememberMe: boolean) => {
        setCurrentUser(user);
        setIsRemembered(rememberMe);
        try {
            sessionStorage.removeItem("currentUser");
            localStorage.removeItem("currentUser");

            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('currentUser', JSON.stringify(user));
        } catch (e) {
            console.error("Failed to save user to storage", e);
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setIsRemembered(false);
        sessionStorage.removeItem("currentUser");
        localStorage.removeItem('currentUser');
    };

    const value = { currentUser, isLoading, login, logout, isRemembered };

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