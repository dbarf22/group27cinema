'use client';
import 'react-phone-number-input/style.css'

import {useState, useEffect, FormEvent} from 'react';
import {useRouter} from 'next/navigation';
import {useSession} from '@/app/session/SessionContext';
import {isPossiblePhoneNumber} from 'react-phone-number-input'


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
    const {currentUser, login, isRemembered} = useSession();

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
            login(data.user, isRemembered);

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
            login(data.user, isRemembered);

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
            login(data.user, isRemembered);

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
            <div className="text-2xl font-semibold text-center mb-4">Edit Profile</div>

            <div className={"collapse collapse-open bg-base-100 border-base-300 border mb-4 shadow-sm"}>
                <input type={"checkbox"}/>
                <div className={"collapse-title font-semibold"}>Profile</div>
                <div className={"collapse-content text-sm"}>
                    <form onSubmit={handleProfile} className="space-y-4 ">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <input
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                className="input"
                            />
                            <input
                                id="email"
                                placeholder="Email"
                                type="email"
                                value={email}
                                disabled
                                className="input"
                            />
                            <input
                                id="firstName"
                                placeholder="First Name"
                                value={first_name}
                                onChange={e => setFirst(e.target.value)}
                                required
                                className="input"
                            />
                            <input
                                id="lastName"
                                placeholder="Last Name"
                                value={last_name}
                                onChange={e => setLast(e.target.value)}
                                required
                                className="input"
                            />
                            <div>
                                <PhoneInput
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(value: E164Number) => setPhone(value)}
                                    defaultCountry="US"
                                    className="input"
                                />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={wantsPromotions}
                                onChange={e => setPromo(e.target.checked)}
                                className="checkbox"
                            />
                            RECEIVE PROMOTIONS?
                        </label>
                        <button type="submit" disabled={busyProfile}
                                className="w-full btn btn-neutral"
                                id={"submitProfileChange"}>
                            {busyProfile ? 'Updating…' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>

            <div className={"collapse collapse-arrow bg-base-100 border-base-300 border mb-4 shadow-sm"}>
                <input type={"checkbox"}/>
                <div className={"collapse-title font-semibold"}>Address Information</div>
                <div className={"collapse-content text-sm"}>
                    <form onSubmit={handleAddress} className="space-y-3">
                        <input
                            id="street"
                            placeholder="123 Example Rd"
                            value={street}
                            onChange={e => setStreet(e.target.value)}
                            className="input w-full"
                        />
                        <div className="grid gap-3 sm:grid-cols-3">
                            <input
                                id="city"
                                placeholder="Athens"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="input"
                            />
                            <input
                                id="state"
                                placeholder="GA"
                                value={state}
                                onChange={e => setState(e.target.value)}
                                maxLength={2}
                                className="input"
                            />
                            <input
                                id="zip"
                                placeholder="30606"
                                value={zip}
                                onChange={e => setZip(e.target.value)}
                                className="input"
                            />
                        </div>
                        <button type="submit" disabled={busyAddress}
                                className="w-full btn btn-neutral"
                                id={"submitAddressChange"}>
                            {busyAddress ? 'Updating…' : 'Update Address'}
                        </button>
                    </form>
                </div>
            </div>


            {msg.error ? (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                     id={"errorMessage"}>{msg.error}</div>
            ) : null}
            {msg.ok ? (
                <div
                    className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                    id={"successMessage"}>{msg.ok}</div>
            ) : null}


            <div className={"collapse collapse-arrow bg-base-100 border-base-300 border mb-4 shadow-sm"}>
                <input type={"checkbox"}/>
                <div className={"collapse-title font-semibold"}>Payment Information</div>
                <div className={"collapse-content text-sm"}>
                    <form onSubmit={handlePayments} className="space-y-4">
                        {cards.length === 0 ? (
                            <p className="text-sm text-gray-600">No cards added.</p>
                        ) : (
                            cards.map((c, i) => (
                                <div key={i} className="card bg-base-100 shadow-sm p-5">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="font-medium">Card {i + 1}</div>
                                        <button type="button" onClick={() => removeCard(i)}
                                                className="btn btn-sm btn btn-error text-error-content">
                                            Remove
                                        </button>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <select
                                            value={c.cardType}
                                            onChange={e => updateCard(i, 'cardType', e.target.value)}
                                            required
                                            className="btn btn-neutral px-3 py-2 text-left"
                                        >
                                            <option value="">Type</option>
                                            <option value="Visa">Visa</option>
                                            <option value="MasterCard">MasterCard</option>
                                            <option value="Discover">Discover</option>
                                            <option value="American Express">American Express</option>
                                        </select>
                                        <input
                                            placeholder="Card number"
                                            id={"cardNumber"}

                                            onChange={e => updateCard(i, 'cardNumber', e.target.value)}
                                            required
                                            maxLength={19}
                                            className="input"
                                        />
                                        <input
                                            placeholder="00"
                                            id={"cardExpMonth"}
                                            value={c.expMonth}
                                            onChange={e => updateCard(i, 'expMonth', e.target.value)}
                                            required
                                            maxLength={2}
                                            className="input"
                                        />
                                        <input
                                            placeholder="0000"
                                            value={c.expYear}
                                            id={"cardExpYear"}
                                            onChange={e => updateCard(i, 'expYear', e.target.value)}
                                            required
                                            maxLength={4}
                                            className="input"
                                        />
                                        <input
                                            placeholder="123 Example Rd"
                                            value={c.billingStreet}
                                            id={"cardBillingStreet"}
                                            onChange={e => updateCard(i, 'billingStreet', e.target.value)}
                                            className="sm:col-span-2 input w-full"
                                        />
                                        <input
                                            placeholder="Athens"
                                            value={c.billingCity}
                                            id={"cardBillingCity"}
                                            onChange={e => updateCard(i, 'billingCity', e.target.value)}
                                            className="input"
                                        />
                                        <input
                                            placeholder="GA"
                                            value={c.billingState}
                                            id={"cardBillingState"}
                                            onChange={e => updateCard(i, 'billingState', e.target.value)}
                                            maxLength={2}
                                            className="input"
                                        />
                                        <input
                                            placeholder="30606"
                                            value={c.billingZip}
                                            id={"cardBillingZip"}
                                            onChange={e => updateCard(i, 'billingZip', e.target.value)}
                                            className="input"
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
                                className="btn btn-neutral btn-sm"
                            >
                                + Add Card ({cards.length}/{maxCards})
                            </button>
                        </div>

                        {cards.length > 0 && (
                            <button type="submit"
                                    disabled={busyPayments}
                                    id={"submitPaymentChange"}
                                    className="w-full btn btn-neutral">
                                {busyPayments ? 'Updating…' : 'Update Payment Methods'}
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className={"collapse collapse-arrow bg-base-100 border-base-300 border mb-4 shadow-sm"}>
                <input type={"checkbox"}/>
                <div className={"collapse-title font-semibold"}>Change Password</div>
                <div className={"collapse-content text-sm"}>
                    <form onSubmit={handlePassword} className="space-y-3">
                        <input
                            id="currentPassword"
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={e => setCurPw(e.target.value)}
                            className="w-full input"
                        />
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={e => setNewPw(e.target.value)}
                            className="w-full input"
                        />
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={e => setConfirmPw(e.target.value)}
                            className="w-full input"
                        />
                        <button
                            type="submit"
                            disabled={busyPassword || !currentPassword || !newPassword}
                            className="w-full btn btn-neutral"
                        >
                            {busyPassword ? 'Changing…' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
}
