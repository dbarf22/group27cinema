"use client";
import 'react-phone-number-input/style.css'
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import PhoneInput from 'react-phone-number-input';
import type { E164Number } from 'libphonenumber-js/core';


type Card = {
  type: string;
  number: string;
  expMonth: string;
  expYear: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
};

const emptyCard: Card = {
  type: "",
  number: "",
  expMonth: "",
  expYear: "",
  billingStreet: "",
  billingCity: "",
  billingState: "",
  billingZip: "",
};


export default function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>();
  const [showVerify, setShowVerify] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [addedInitialCard, setAddedInitialCard] = useState(false);
  const maxCards = 3;

  // helper function updateCard for adding or updating information fields in a card
  // ensures that only the selected field and card is updated and properly re-rerendered to React
  function updateCard(cardIndex: number, field: keyof Card, value: string) {
    setCards((prev) => {
      const copy = [...prev]; // copy of previous card array state
      copy[cardIndex] = { ...copy[cardIndex], [field]: value }; // makes new version of card with only updated field information
      return copy; // replaces previous card state with updated info
    });
  }

  function addCard() {
    if (cards.length >= maxCards) return;
    setCards((prev) => [...prev, { ...emptyCard }]);
  }

  function removeCard(cardIndex: number) {
    if (cards.length <= 1) return;
    setCards((prev) => prev.filter((_, i) => i !== cardIndex));
  }

  function togglePayments() {
    setShowPayments((prev) => {
      const next = !prev;
      if (next && !addedInitialCard) {
        setCards([{ ...emptyCard }]);
        setAddedInitialCard(true); //Ensures that only the first card info form pops up when toggling show payment method
      }
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setError("");
      const f = new FormData(e.currentTarget);

      // User acct stuff
      const username = String(f.get("username") || "").trim();
      const email = String(f.get("email") || "").trim();
      const firstName = String(f.get("firstName") || "").trim();
      const lastName = String(f.get("lastName") || "").trim();
      const password = String(f.get("password") || "");
      const wantsPromotions = f.get("wantsPromotions") === "on";

      const street = String(f.get("street") || "").trim();
      const city = String(f.get("city") || "").trim();
      const state = String(f.get("state") || "").trim();
      const zipCode = String(f.get("zipCode") || "").trim();

      if (!username || !email || !firstName || !lastName || !password || !phoneNumber) {
          setError("All fields are required.");
          return;
      }

      try {
          const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  username,
                  email,
                  firstName,
                  lastName,
                  password,
                  wantsPromotions,
                  phoneNumber: phoneNumber,
                  street,
                  city,
                  state,
                  zipCode
              }),
          });

          if (!res.ok) {
              const errorText = await res.text();
              throw new Error(errorText || "Registration failed");
          }

          // todo: verify email
          router.push("/login");

      } catch (err: any) {
          setError(err.message || "An error occurred.");
      }
  }

  return (
    <div className="mx-auto mt-14 px-4 max-w-4xl">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
        {!showVerify ? (
          <>
            <h1 className="text-3xl text-center tracking-wide">CREATE ACCOUNT</h1>
            <p className="mt-1 text-center text-sm text-gray-600">
              Provide your details to register
            </p>

            {error && (
              <div
                role="alert"
                className="mt-4 text-sm text-red-700 bg-red-50 p-2 rounded border border-red-200"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                    <label htmlFor={"phoneNumber"} className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <PhoneInput
                        id="phoneNumber"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(value: E164Number) => setPhoneNumber(value || undefined)}
                        defaultCountry="US"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-black"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
              </div>

                <div className="flex items-center gap-2">
                    <input
                        type={"checkbox"}
                        id={"wantsPromotions"}
                        name={"wantsPromotions"}
                        className={"h-4 w-4 rounded border-gray-300 text-black focus:ring-black"}
                    />
                    <label htmlFor={"wantsPromotions"} className={"text-sm text-gray-700"}>
                        I want to receive promotions.
                    </label>
                </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowAddress((v) => !v)}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-700 hover:text-black"
                >
                  Add Home Address (Optional)
                  <span className="text-lg">{showAddress ? "▾" : "▸"}</span>
                </button>

                {showAddress && (
                  <div className="mt-2 ml-2 space-y-3">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                        Street
                      </label>
                      <input
                        id="street"
                        name="street"
                        type="text"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          id="state"
                          name="state"
                          type="text"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          Zip Code
                        </label>
                        <input
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={togglePayments}
                  className="w-full flex items-center justify-between text-left font-medium text-gray-700 hover:text-black"
                >
                  Add Payment Methods (Optional)
                  <span className="text-lg">{showPayments ? "▾" : "▸"}</span>
                </button>

                {showPayments && (
                  <div className="mt-2 ml-2 space-y-6">
                    {cards.map((card, cardIndex) => (
                      <div key={cardIndex} className="rounded-xl border border-gray-200 p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                            <select
                              value={card.type}
                              onChange={(e) => updateCard(cardIndex, "type", e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                            >
                              <option value="">Select</option>
                              <option value="Visa">Visa</option>
                              <option value="MasterCard">MasterCard</option>
                              <option value="Discover">Discover</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input
                              type="text"
                              value={card.number}
                              onChange={(e) => updateCard(cardIndex, "number", e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Month</label>
                            <input
                              type="text"
                              value={card.expMonth}
                              onChange={(e) => updateCard(cardIndex, "expMonth", e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                              placeholder="MM"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Year</label>
                            <input
                              type="text"
                              value={card.expYear}
                              onChange={(e) => updateCard(cardIndex, "expYear", e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                              placeholder="YYYY"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Billing Street</label>
                            <input
                              type="text"
                              value={card.billingStreet}
                              onChange={(e) => updateCard(cardIndex, "billingStreet", e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Billing City</label>
                            <input
                              type="text"
                              value={card.billingCity}
                              onChange={(e) => updateCard(cardIndex, "billingCity", e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Billing State</label>
                            <input
                              type="text"
                              value={card.billingState}
                              onChange={(e) => updateCard(cardIndex, "billingState", e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Billing Zip</label>
                            <input
                              type="text"
                              value={card.billingZip}
                              onChange={(e) => updateCard(cardIndex, "billingZip", e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end gap-2">
                          {cards.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCard(cardIndex)}
                              className="px-3 py-2 text-sm rounded-xl border border-gray-300 hover:bg-gray-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={addCard}
                        disabled={cards.length >= maxCards}
                        className="text-sm text-gray-700 underline hover:text-black disabled:opacity-50"
                      >
                        + Add Another Card
                      </button>
                      <span className="text-sm text-gray-600">{cards.length}/{maxCards}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-black px-4 py-2.5 font-semibold text-white hover:bg-neutral-900 transition"
              >
                Sign Up
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Verification Code Sent!</h2>
            <p className="text-sm text-gray-700 mb-6">
              Please check your email and enter the verification code below:
            </p>
            <div className="max-w-sm mx-auto">
              <input
                type="text"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                onClick={() => router.push("/login")} //Redirect to login page after confirming
                className="mt-4 w-full rounded-xl bg-black px-4 py-2.5 font-semibold text-white hover:bg-neutral-900 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
