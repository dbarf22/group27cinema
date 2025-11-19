'use client';
import 'react-phone-number-input/style.css'

import {useState, useEffect, FormEvent} from 'react';
import {useRouter} from 'next/navigation';
import {useSession} from '@/app/session/SessionContext';
import { isPossiblePhoneNumber } from 'react-phone-number-input'


import PhoneInput from 'react-phone-number-input';
import type {E164Number} from 'libphonenumber-js/core';

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

const emptyCard: Card = {
    cardType: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
};

export default function EditProfilePage() {
    const router = useRouter();
    const {currentUser, login} = useSession();

    const [msg, setMsg] = useState({error: '', ok: ''});
    const [busyProfile, setBusyProfile] = useState(false);
    const [busyAddress, setBusyAddress] = useState(false);
    const [busyPayments, setBusyPayments] = useState(false);
    const [busyPassword, setBusyPassword] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const [first_name, setFirst] = useState('');
    const [last_name, setLast] = useState('');
    const [phoneNumber, setPhone] = useState('')
    const [wantsPromotions, setPromo] = useState(false);

    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');

    const [cards, setCards] = useState<Card[]>([]);
    const maxCards = 3;

    const [currentPassword, setCurPw] = useState('');
    const [newPassword, setNewPw] = useState('');
    const [confirmPassword, setConfirmPw] = useState('');

    const [showAddress, setShowAddress] = useState(false);
    const [showPayments, setShowPayments] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            router.push('/login');
            return;
        }
        setUsername(currentUser.username || '');
        setEmail(currentUser.email || '');
        setPhone(currentUser.phoneNumber || '');
        setFirst(currentUser.firstName || '');
        setLast(currentUser.lastName || '');
        setPromo(currentUser.wantsPromotions || false);
        setCards(currentUser.cards || []);
        setState(currentUser.state || '');
        setStreet(currentUser.street || '');
        setCity(currentUser.city || '');
        setZip(currentUser.zipCode || '')

    }, [currentUser, router]);

    const setError = (s: string) => setMsg({error: s, ok: ''});
    const setOk = (s: string) => setMsg({error: '', ok: s});

    const updateCard = (i: number, k: keyof Card, v: string) =>
        setCards(prev => {
            const next = [...prev];
            next[i] = {...next[i], [k]: v};
            return next;
        });

    const addCard = () => cards.length < maxCards && setCards(prev => [...prev, {...emptyCard}]);
    const removeCard = (i: number) => setCards(prev => prev.filter((_, idx) => idx !== i));

    const handleProfile = async (e: FormEvent) => {
        e.preventDefault();
        setBusyProfile(true);
        setError('');
        setOk('');

        try {
            if (!isPossiblePhoneNumber(phoneNumber)) {
                throw new Error('Phone number is invalid.');
            }
            const res = await fetch("http://localhost:8080/api/auth/edit-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    firstName: first_name,
                    lastName: last_name,
                    wantsPromotions,
                    phoneNumber,
                    street,
                    city,
                    state,
                    zipCode: zip,
                    cards,
                }),
            });

            const data = await res.json();
            login(data.user);

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Edit profile failed");
            }
            setOk("Profile successfully updated!");

        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setBusyProfile(false);
        }

    };

    const handleAddress = async (e: FormEvent) => {
        e.preventDefault();
        setBusyAddress(true);
        setError('');
        setOk('');

         try {
            if (!isPossiblePhoneNumber(phoneNumber)) {
                throw new Error('Phone number is invalid.');
            }
            const res = await fetch("http://localhost:8080/api/auth/edit-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    street,
                    city,
                    state,
                    zipCode: zip,
                }),
            });

            const data = await res.json();
            login(data.user);

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Edit address failed");
            }
            setOk("Address successfully updated!");

        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setBusyAddress(false);
        }
    };

    const handlePayments = async (e: FormEvent) => {
        e.preventDefault();
        setBusyPayments(true);
        setError('');
        setOk('');

        setMsg({error: '', ok: ''});
        for (let i = 0; i < cards.length; i++) {
            const c = cards[i];
            if (!c.cardType || !c.cardNumber || !c.expMonth || !c.expYear) {
                setError(`Card ${i + 1}: fill required fields`);
                return;
            }
        }
         try {
            if (!isPossiblePhoneNumber(phoneNumber)) {
                throw new Error('Phone number is invalid.');
            }
            const res = await fetch("http://localhost:8080/api/auth/edit-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    cards
                }),
            });

            const data = await res.json();
            login(data.user);

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Edit payment info failed");
            }
            setOk("Payment info successfully updated!");

        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setBusyPayments(false);
        }
    };

    const handlePassword = async (e: FormEvent) => {
        e.preventDefault();
        setMsg({error: '', ok: ''});
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setError('Min 6 characters');
            return;
        }
        setBusyPassword(true);
        try {
            const res = await fetch("http://localhost:8080/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: currentPassword,
                    newPassword: newPassword,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to change password");
            }

            setOk("Password changed successfully.");
            setCurPw("");
            setNewPw("");
            setConfirmPw("");
        } catch (err: any) {
            setError(err.message || "An error occurred while changing the password");
        } finally {
            setBusyPassword(false);
        }


    };

    if (!currentUser) return null;

    return (
        <div className="mx-auto max-w-3xl p-6">
            <h1 className="text-2xl font-semibold text-center mb-4">Edit Profile</h1>

            {msg.error ? (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{msg.error}</div>
            ) : null}
            {msg.ok ? (
                <div
                    className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">{msg.ok}</div>
            ) : null}

            <form onSubmit={handleProfile} className="space-y-4 border-b pb-6 mb-6">
                <h2 className="text-lg font-medium">Profile</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                    <input
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="rounded border px-3 py-2"
                    />
                    <input
                        id="email"
                        placeholder="Email"
                        type="email"
                        value={email}
                        disabled
                        className="rounded border px-3 py-2 bg-gray-100"
                    />
                    <input
                        id="firstName"
                        placeholder="First Name"
                        value={first_name}
                        onChange={e => setFirst(e.target.value)}
                        required
                        className="rounded border px-3 py-2"
                    />
                    <input
                        id="lastName"
                        placeholder="Last Name"
                        value={last_name}
                        onChange={e => setLast(e.target.value)}
                        required
                        className="rounded border px-3 py-2"
                    />
                    <div>
                        <PhoneInput
                            id="phoneNumber"
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={(value: E164Number) => setPhone(value)}
                            defaultCountry="US"
                            className="rounded border px-3 py-2"
                        />
                    </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={wantsPromotions}
                        onChange={e => setPromo(e.target.checked)}
                        className="h-4 w-4"
                    />
                    RECEIVE PROMOTIONS?
                </label>
                <button type="submit" disabled={busyProfile}
                        className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50">
                    {busyProfile ? 'Updating…' : 'Update Profile'}
                </button>
            </form>

            <div className="border-b pb-6 mb-6">
                <button
                    type="button"
                    onClick={() => setShowAddress(s => !s)}
                    className="mb-4 flex w-full items-center justify-between text-left text-lg font-medium"
                >
                    Home Address <span>{showAddress ? '−' : '+'}</span>
                </button>

                {showAddress && (
                    <form onSubmit={handleAddress} className="space-y-3">
                        <input
                            id="street"
                            placeholder="123 Example Rd"
                            value={street}
                            onChange={e => setStreet(e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <div className="grid gap-3 sm:grid-cols-3">
                            <input
                                id="city"
                                placeholder="Athens"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="rounded border px-3 py-2"
                            />
                            <input
                                id="state"
                                placeholder="GA"
                                value={state}
                                onChange={e => setState(e.target.value)}
                                maxLength={2}
                                className="rounded border px-3 py-2"
                            />
                            <input
                                id="zip"
                                placeholder="30606"
                                value={zip}
                                onChange={e => setZip(e.target.value)}
                                className="rounded border px-3 py-2"
                            />
                        </div>
                        <button type="submit" disabled={busyAddress}
                                className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50">
                            {busyAddress ? 'Updating…' : 'Update Address'}
                        </button>
                    </form>
                )}
            </div>

            <div className="border-b pb-6 mb-6">
                <button
                    type="button"
                    onClick={() => setShowPayments(s => !s)}
                    className="mb-4 flex w-full items-center justify-between text-left text-lg font-medium"
                >
                    Payment Methods <span>{showPayments ? '−' : '+'}</span>
                </button>

                {showPayments && (
                    <form onSubmit={handlePayments} className="space-y-4">
                        {cards.length === 0 ? (
                            <p className="text-sm text-gray-600">No cards added.</p>
                        ) : (
                            cards.map((c, i) => (
                                <div key={i} className="rounded border p-3">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="font-medium">Card {i + 1}</div>
                                        <button type="button" onClick={() => removeCard(i)}
                                                className="text-sm text-red-600">
                                            Remove
                                        </button>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <select
                                            value={c.cardType}
                                            onChange={e => updateCard(i, 'cardType', e.target.value)}
                                            required
                                            className="rounded border px-3 py-2 bg-white"
                                        >
                                            <option value="">Type</option>
                                            <option value="Visa">Visa</option>
                                            <option value="MasterCard">MasterCard</option>
                                            <option value="Discover">Discover</option>
                                            <option value="American Express">American Express</option>
                                        </select>
                                        <input
                                            placeholder="Card number"

                                            onChange={e => updateCard(i, 'cardNumber', e.target.value)}
                                            required
                                            maxLength={19}
                                            className="rounded border px-3 py-2"
                                        />
                                        <input
                                            placeholder="00"
                                            value={c.expMonth}
                                            onChange={e => updateCard(i, 'expMonth', e.target.value)}
                                            required
                                            maxLength={2}
                                            className="rounded border px-3 py-2"
                                        />
                                        <input
                                            placeholder="0000"
                                            value={c.expYear}
                                            onChange={e => updateCard(i, 'expYear', e.target.value)}
                                            required
                                            maxLength={4}
                                            className="rounded border px-3 py-2"
                                        />
                                        <input
                                            placeholder="123 Example Rd"
                                            value={c.billingStreet}
                                            onChange={e => updateCard(i, 'billingStreet', e.target.value)}
                                            className="sm:col-span-2 rounded border px-3 py-2"
                                        />
                                        <input
                                            placeholder="Athens"
                                            value={c.billingCity}
                                            onChange={e => updateCard(i, 'billingCity', e.target.value)}
                                            className="rounded border px-3 py-2"
                                        />
                                        <input
                                            placeholder="GA"
                                            value={c.billingState}
                                            onChange={e => updateCard(i, 'billingState', e.target.value)}
                                            maxLength={2}
                                            className="rounded border px-3 py-2"
                                        />
                                        <input
                                            placeholder="30606"
                                            value={c.billingZip}
                                            onChange={e => updateCard(i, 'billingZip', e.target.value)}
                                            className="rounded border px-3 py-2"
                                        />
                                    </div>
                                </div>
                            ))
                        )}

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={addCard}
                                disabled={cards.length >= maxCards}
                                className="text-sm text-blue-600 disabled:opacity-50"
                            >
                                + Add Card ({cards.length}/{maxCards})
                            </button>
                        </div>

                        {cards.length > 0 && (
                            <button type="submit" disabled={busyPayments}
                                    className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50">
                                {busyPayments ? 'Updating…' : 'Update Payment Methods'}
                            </button>
                        )}
                    </form>
                )}
            </div>

            <div>
                <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="mb-4 flex w-full items-center justify-between text-left text-lg font-medium"
                >
                    Change Password <span>{showPassword ? '−' : '+'}</span>
                </button>

                {showPassword && (
                    <form onSubmit={handlePassword} className="space-y-3">
                        <input
                            id="currentPassword"
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={e => setCurPw(e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={e => setNewPw(e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={e => setConfirmPw(e.target.value)}
                            className="w-full rounded border px-3 py-2"
                        />
                        <button
                            type="submit"
                            disabled={busyPassword || !currentPassword || !newPassword}
                            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                        >
                            {busyPassword ? 'Changing…' : 'Change Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
