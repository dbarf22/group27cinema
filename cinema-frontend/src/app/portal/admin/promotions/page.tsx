"use client";
import {useMemo, useState, FormEvent} from "react";

type CreateErrors = {
    code?: string;
    discount?: string;
    start?: string;
    end?: string;
    description?: string;
};

export default function ManagePromotionsPage() {
    const [createOpen, setCreateOpen] = useState(true);
    const [emailOpen, setEmailOpen] = useState(false);

    const [promo, setPromo] = useState({
        code: "",
        discount: "",
        start: "",
        end: "",
        description: "",
    });
    const [errs, setErrs] = useState<CreateErrors>({});
    const [promoIsSubmitting, setPromoIsSubmitting] = useState(false);
    const [promoSuccessMessage, setPromoSuccessMessage] = useState("");

    const [emailForm, setEmailForm] = useState({
        subject: "",
        message: "",
        promoCode: "",
    });

    // Simple enable/disable check for the button
    const isCreateValid = useMemo(() => {
        const d = Number(promo.discount);
        if (!promo.code.trim()) return false;
        if (promo.discount.trim() === "" || Number.isNaN(d) || d < 0 || d > 100)
            return false;
        if (!promo.start || !promo.end) return false;
        if (promo.start && promo.end && new Date(promo.start) > new Date(promo.end))
            return false;
        if (!promo.description.trim()) return false;
        return true;
    }, [promo]);

    // --- PROMOTIONS VALIDATION ---
    const validateCreate = () => {
        const next: CreateErrors = {};

        if (!promo.code.trim()) next.code = "Promotion code is required.";

        if (!promo.discount.trim()) {
            next.discount = "Discount is required.";
        } else {
            const d = Number(promo.discount);
            if (Number.isNaN(d) || d < 0 || d > 100) {
                next.discount = "Discount must be between 0 and 100.";
            }
        }

        if (!promo.start.trim()) next.start = "Start date is required.";
        if (!promo.end.trim()) next.end = "End date is required.";
        if (promo.start && promo.end && new Date(promo.start) > new Date(promo.end)) {
            next.end = "End date must be on or after start date.";
        }

        if (!promo.description.trim())
            next.description = "Description is required.";

        setErrs(next);
        return Object.keys(next).length === 0;
    };

    async function handlePromoSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validateCreate()) return;
        if (promoIsSubmitting) return;

        setPromoIsSubmitting(true);
        setPromoSuccessMessage("");

        try {
            const res = await fetch("/api/admin/promotions/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    promoCode: promo.code,
                    discount: Number(promo.discount),
                    startDate: promo.start,
                    endDate: promo.end,
                    description: promo.description,
                }),
            });

            if (!res.ok) throw new Error("Failed to add promotion");

            setPromoSuccessMessage("Promotion saved successfully!");

            // Reset promo form
            setPromo({
                code: "",
                discount: "",
                start: "",
                end: "",
                description: "",
            });
            setErrs({});

            setTimeout(() => setPromoSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Error saving promotion", err);
            setPromoSuccessMessage("Something went wrong saving the promotion.");
            setTimeout(() => setPromoSuccessMessage(""), 3000);
        } finally {
            setPromoIsSubmitting(false);
        }
    }

    const submitEmail = () => {
        if (!emailForm.subject.trim() || !emailForm.message.trim()) {
            alert("Please fill in Subject and Message.");
            return;
        }
        console.log("Email Promotion (frontend only):", {
            subject: emailForm.subject,
            message: emailForm.message,
            promoCode: emailForm.promoCode || null,
            onlySubscribedUsers: true,
        });
        alert("frontend only (email not set up yet)");
    };

    return (
        <div>
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold ">Manage Promotions</h1>
                        <p>
                            Create promotions and email them to subscribed users.
                        </p>
                    </div>

                    <a
                        href="/portal"
                        className="inline-flex items-center gap-2 px-4 py-2 font-semibold btn"
                    >
                        ← Back to Admin
                    </a>
                </div>

                {/* CREATE PROMOTION */}
                <div className="collapse collapse-open border border-base-300 p-6 shadow-sm">
                    <form onSubmit={handlePromoSubmit} className="grid gap-6">
                        <div>
                            <input
                                className={`mt-1 w-full input p-2 ${
                                    errs.code ? "border-error" : ""
                                }`}
                                value={promo.code}
                                onChange={(e) =>
                                    setPromo((p) => ({
                                        ...p,
                                        code: e.target.value.toUpperCase(),
                                    }))
                                }
                                onBlur={validateCreate}
                                placeholder="Promo Code"
                            />
                            {errs.code && (
                                <p className="mt-2 text-sm text-error">{errs.code}</p>
                            )}
                        </div>

                        <div className="max-w-xs">
                            <input
                                type="number"
                                min={0}
                                max={100}
                                className={`mt-1 w-full input p-2 ${
                                    errs.discount ? "border-error" : ""
                                }`}
                                value={promo.discount}
                                onChange={(e) =>
                                    setPromo((p) => ({...p, discount: e.target.value}))
                                }
                                onBlur={validateCreate}
                                placeholder="Discount %"
                            />
                            {errs.discount && (
                                <p className="mt-2 text-sm text-error">
                                    {errs.discount}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    className={`mt-1 w-full input p-2 ${
                                        errs.start ? "border-red-500" : ""
                                    }`}
                                    value={promo.start}
                                    onChange={(e) =>
                                        setPromo((p) => ({...p, start: e.target.value}))
                                    }
                                    onBlur={validateCreate}
                                />
                                {errs.start && (
                                    <p className="mt-2 text-sm text-error">{errs.start}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm ">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    className={`mt-1 w-full input p-2 ${
                                        errs.end ? "border-error" : ""
                                    }`}
                                    value={promo.end}
                                    onChange={(e) =>
                                        setPromo((p) => ({...p, end: e.target.value}))
                                    }
                                    onBlur={validateCreate}
                                />
                                {errs.end && (
                                    <p className="mt-2 text-sm text-error">{errs.end}</p>
                                )}
                            </div>
                        </div>

                        <div>
                    <textarea
                        className={`mt-1 w-full input p-2 min-h-24 ${
                            errs.description ? "border-error" : ""
                        }`}
                        value={promo.description}
                        onChange={(e) =>
                            setPromo((p) => ({...p, description: e.target.value}))
                        }
                        onBlur={validateCreate}
                        placeholder="Promo description"
                    />
                            {errs.description && (
                                <p className="mt-2 text-sm text-error">
                                    {errs.description}
                                </p>
                            )}
                        </div>

                        {promoSuccessMessage && (
                            <div className="rounded bg-success bg-success-content px-4 py-2 text-sm">
                                {promoSuccessMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!isCreateValid || promoIsSubmitting}
                            className={` px-4 py-2 font-semibold btn btn-neutral ${
                                !isCreateValid || promoIsSubmitting
                                    ? "cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {promoIsSubmitting ? "Saving Promotion..." : "Create Promotion"}
                        </button>
                    </form>
                </div>

                {/* EMAIL PROMOTION SECTION (still frontend-only) */}
                <div className="collapse collapse-open border border-base-300 p-6 shadow-sm">
                    <div
                        id="email-panel"
                        className="grid-rows-[1fr]">
                        <div className="min-h-0">
                            <div className="  grid gap-6">
                                <div>
                                    <input
                                        className="mt-1 w-full input p-2"
                                        value={emailForm.subject}
                                        onChange={(e) =>
                                            setEmailForm((f) => ({...f, subject: e.target.value}))
                                        }
                                        placeholder="Subject line"
                                    />
                                </div>
                                <div>
                  <textarea
                      className="mt-1 w-full input p-2 min-h-28"
                      value={emailForm.message}
                      onChange={(e) =>
                          setEmailForm((f) => ({...f, message: e.target.value}))
                      }
                      placeholder="Write your promotional email message here…"
                  />
                                </div>

                                <div className="max-w-sm">

                                    <input
                                        className="mt-1 w-full input p-2"
                                        value={emailForm.promoCode}
                                        onChange={(e) =>
                                            setEmailForm((f) => ({
                                                ...f,
                                                promoCode: e.target.value.toUpperCase(),
                                            }))
                                        }
                                        placeholder="Enter Promo Code"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={submitEmail}
                                        className="btn px-4 py-2 font-semibold "
                                    >
                                        Send Email
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 font-semibold btn"
                                        onClick={() =>
                                            alert(
                                                `Preview (frontend only):\n\nSubject: ${emailForm.subject}\nPromo Code: ${
                                                    emailForm.promoCode || "(none)"
                                                }\n\n${emailForm.message}`
                                            )
                                        }
                                    >
                                        Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
