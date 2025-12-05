"use client";
import 'react-phone-number-input/style.css'
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import PhoneInput from 'react-phone-number-input';
import type { E164Number } from 'libphonenumber-js/core';


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
  cardType: "",
  cardNumber: "",
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

      // Address stuff
      const street = String(f.get("street") || "").trim();
      const city = String(f.get("city") || "").trim();
      const state = String(f.get("state") || "").trim();
      const zipCode = String(f.get("zipCode") || "").trim();

      if (!username || !email || !firstName || !lastName || !password || !phoneNumber) {
          setError("All fields are required.");
          return;
      }

      if (street && city && state && zipCode) {
          } else if (!street && !city && !state && !zipCode) {
          } else {
              setError("All address fields must be filled if adding address.")
              return;
          }

      for (const card of cards) {
          if (card.cardType && card.expMonth && card.expYear && card.billingStreet) {
          } else if (!card.cardType && !card.expMonth && !card.expYear && !card.billingStreet) {
          } else {
              setError("All payment fields must be filled if adding payment.")
              return;
          }
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
                  zipCode,
                  cards,
              }),
          });

          if (!res.ok) {
              const errorText = await res.text();
              throw new Error(errorText || "Registration failed");
          }

          router.push("/account-verify");

      } catch (err: any) {
          setError(err.message || "An error occurred.");
      }
  }

  return (
    <div className="mx-auto mt-14 px-4 max-w-4xl">
      <div className="collapse collapse-open bg-base-100 border-base-300 border mb-4 shadow-sm p-8">
        {!showVerify ? (
          <>
            <h1 className="text-3xl text-center text-semibold">CREATE ACCOUNT</h1>
            <p className="mt-1 text-center text-sm ">
              Provide your details to register
            </p>

            {error && (
              <div
                role="alert"
                className="mt-4 text-sm text-error-content bg-error p-2 rounded border"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder={"Username"}
                    required
                    className="w-full px-3 py-2 input"
                  />
                </div>
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={"Email"}
                    required
                    className="w-full px-3 py-2 input"
                  />
                </div>
                <div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder={"First Name"}
                    required
                    className="w-full px-3 py-2 input"
                  />
                </div>
                <div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder={"Last Name"}
                    required
                    className="w-full px-3 py-2 input"
                  />
                </div>
                <div>
                    <PhoneInput
                        id="phoneNumber"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(value: E164Number) => setPhoneNumber(value || undefined)}
                        defaultCountry="US"
                        placeholder={"Phone Number"}
                        className="w-full px-3 py-2 input"
                    />
                </div>
                <div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder={"Password"}
                        required
                        className="w-full px-3 py-2 input"
                    />
                </div>
              </div>

                <div className="flex items-center gap-2">
                    <input
                        type={"checkbox"}
                        id={"wantsPromotions"}
                        name={"wantsPromotions"}
                        className={"h-4 w-4 checkbox"}
                    />
                    <label htmlFor={"wantsPromotions"} className={"text-sm"}>
                        I want to receive promotions.
                    </label>
                </div>

              <div className="space-y-2">
                  <div className={"collapse collapse-arrow bg-base-100 border-base-300 border mb-4 shadow-sm"}>
                      <input type={"checkbox"}/>
                      <div className={"collapse-title font-semibold"}>Add Address Information (optional)</div>
                      <div className={"collapse-content text-sm"}>

                  <div className="mt-2 ml-2 space-y-3">
                      <div>

                          <input
                              placeholder="Street Address"
                              id="street"
                              name="street"
                              type="text"
                              className="w-full px-3 py-2 input"
                          />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                              <input
                                  placeholder={"City"}
                                  id="city"
                                  name="city"
                                  type="text"
                                  className="w-full px-3 py-2 input"
                              />
                          </div>
                          <div>

                              <input
                                  placeholder={"State"}
                                  id="state"
                                  name="state"
                                  type="text"
                                  className="w-full px-3 py-2 input"
                              />
                          </div>
                          <div>
                              <input
                                  placeholder={"Zip Code"}
                                  id="zipCode"
                                  name="zipCode"
                                  type="text"
                                  className="w-full px-3 py-2 input"
                              />
                          </div>
                      </div>
                  </div>
                      </div>
                  </div>

              </div>

              <div className="space-y-2">
                  <div className={"collapse collapse-arrow bg-base-100 border-base-300 border mb-4 shadow-sm"}>
                      <input type={"checkbox"}/>
                      <div className={"collapse-title font-semibold"}>Add Payment Information (optional)</div>
                      <div className={"collapse-content text-sm"}>
                  <div className="mt-2 ml-2 space-y-6">
                      {cards.map((card, cardIndex) => (
                          <div key={cardIndex} className="card card-border bg-base-300 p-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                      <select
                                          value={card.cardType}
                                          onChange={(e) => updateCard(cardIndex, "cardType", e.target.value)}
                                          className="w-full px-3 py-2 btn btn-neutral"
                                      >
                                          <option value="">Select Card Type</option>
                                          <option value="Visa">Visa</option>
                                          <option value="MasterCard">MasterCard</option>
                                          <option value="Discover">Discover</option>
                                      </select>
                                  </div>
                                  <div>
                                      <input
                                          type="text"
                                          placeholder={'Card Number'}
                                          value={card.cardNumber}
                                          onChange={(e) => updateCard(cardIndex, "cardNumber", e.target.value)}
                                          className="w-full px-3 py-2 input"
                                      />
                                  </div>
                                  <div>
                                      <input
                                          type="text"
                                          value={card.expMonth}
                                          onChange={(e) => updateCard(cardIndex, "expMonth", e.target.value)}
                                          className="w-full px-3 py-2 input"
                                          placeholder={"Expiration Month"}
                                      />
                                  </div>
                                  <div>
                                      <input
                                          type="text"
                                          value={card.expYear}
                                          onChange={(e) => updateCard(cardIndex, "expYear", e.target.value)}
                                          className="w-full px-3 py-2 input"
                                          placeholder="Expiration Year"
                                      />
                                  </div>
                                  <div className="sm:col-span-2">
                                      <input
                                          type="text"
                                          placeholder={"Billing Street"}
                                          value={card.billingStreet}
                                          onChange={(e) => updateCard(cardIndex, "billingStreet", e.target.value)}
                                          className="w-full px-3 py-2 input"
                                      />
                                  </div>
                                  <div>
                                      <input
                                          type="text"
                                          placeholder={"Billing City"}
                                          value={card.billingCity}
                                          onChange={(e) => updateCard(cardIndex, "billingCity", e.target.value)}
                                          className="w-full px-3 py-2 input"
                                      />
                                  </div>
                                  <div>
                                      <input
                                          type="text"
                                          placeholder={"Billing State"}
                                          value={card.billingState}
                                          onChange={(e) => updateCard(cardIndex, "billingState", e.target.value)}
                                          className="w-full px-3 py-2 input"
                                      />
                                  </div>
                                  <div>
                                      <input
                                          type="text"
                                          placeholder={"Billing Zip"}
                                          value={card.billingZip}
                                          onChange={(e) => updateCard(cardIndex, "billingZip", e.target.value)}
                                          className="w-full px-3 py-2 input"
                                      />
                                  </div>
                              </div>
                              <div className="mt-3 flex justify-end gap-2">
                                  {cards.length > 0 && (
                                      <button
                                          type="button"
                                          onClick={() => removeCard(cardIndex)}
                                          className="px-3 py-2 text-sm btn btn-error text-error-content"
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
                              className="text-sm btn btn-neutral"
                          >
                              + Add Another Card
                          </button>
                          <span className="text-sm ">{cards.length}/{maxCards}</span>
                      </div>
                  </div>
                      </div>
                  </div>

              </div>

              <button
                type="submit"
                className="w-full  px-4 py-2.5 btn btn-neutral"
              >
                Sign Up
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Verification Code Sent!</h2>
            <p className="text-sm  mb-6">
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
