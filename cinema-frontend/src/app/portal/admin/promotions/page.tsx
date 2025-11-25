"use client";
import { useMemo, useState, FormEvent } from "react";

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
            <h1 className="text-3xl font-bold text-gray-900">Manage Promotions</h1>
            <p className="text-gray-600">
              Create promotions and email them to subscribed users.
            </p>
          </div>

          <a
            href="/portal"
            className="inline-flex items-center gap-2 rounded border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50"
          >
            ← Back to Admin
          </a>
        </div>

        {/* CREATE PROMOTION */}
        <section className="rounded-2xl border bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setCreateOpen((v) => !v)}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
            aria-expanded={createOpen}
            aria-controls="create-panel"
          >
            <div>
              <div className="text-lg font-semibold text-gray-900">Create Promotion</div>
              <div className="text-sm text-gray-600">
                Required: promo code, start/end date, discount %, description
              </div>
            </div>
            <svg
              className={`h-5 w-5 text-gray-700 transition-transform ${
                createOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.94 1.17l-4.2 3.33a.75.75 0 01-.94 0l-4.2-3.33a.75.75 0 01-.08-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div
            id="create-panel"
            className={`grid overflow-hidden transition-all duration-300 ${
              createOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <div className="border-t px-6 py-6 grid gap-6">
                <form onSubmit={handlePromoSubmit} className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Promo Code *
                    </label>
                    <input
                      className={`mt-1 w-full rounded border p-2 ${
                        errs.code ? "border-red-500" : "border-gray-300"
                      }`}
                      value={promo.code}
                      onChange={(e) =>
                        setPromo((p) => ({
                          ...p,
                          code: e.target.value.toUpperCase(),
                        }))
                      }
                      onBlur={validateCreate}
                      placeholder="SAVE10"
                    />
                    {errs.code && (
                      <p className="mt-2 text-sm text-red-600">{errs.code}</p>
                    )}
                  </div>

                  <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700">
                      Discount % *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className={`mt-1 w-full rounded border p-2 ${
                        errs.discount ? "border-red-500" : "border-gray-300"
                      }`}
                      value={promo.discount}
                      onChange={(e) =>
                        setPromo((p) => ({ ...p, discount: e.target.value }))
                      }
                      onBlur={validateCreate}
                      placeholder="10"
                    />
                    {errs.discount && (
                      <p className="mt-2 text-sm text-red-600">
                        {errs.discount}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date * 
                      </label>
                      <input
                        type="date"
                        className={`mt-1 w-full rounded border p-2 ${
                          errs.start ? "border-red-500" : "border-gray-300"
                        }`}
                        value={promo.start}
                        onChange={(e) =>
                          setPromo((p) => ({ ...p, start: e.target.value }))
                        }
                        onBlur={validateCreate}
                      />
                      {errs.start && (
                        <p className="mt-2 text-sm text-red-600">{errs.start}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Date *
                      </label>
                      <input
                        type="date"
                        className={`mt-1 w-full rounded border p-2 ${
                          errs.end ? "border-red-500" : "border-gray-300"
                        }`}
                        value={promo.end}
                        onChange={(e) =>
                          setPromo((p) => ({ ...p, end: e.target.value }))
                        }
                        onBlur={validateCreate}
                      />
                      {errs.end && (
                        <p className="mt-2 text-sm text-red-600">{errs.end}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      className={`mt-1 w-full rounded border p-2 min-h-24 ${
                        errs.description ? "border-red-500" : "border-gray-300"
                      }`}
                      value={promo.description}
                      onChange={(e) =>
                        setPromo((p) => ({ ...p, description: e.target.value }))
                      }
                      onBlur={validateCreate}
                      placeholder="Describe the promotion, terms, etc."
                    />
                    {errs.description && (
                      <p className="mt-2 text-sm text-red-600">
                        {errs.description}
                      </p>
                    )}
                  </div>

                  {promoSuccessMessage && (
                    <div className="rounded bg-green-100 text-green-800 px-4 py-2 text-sm">
                      {promoSuccessMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isCreateValid || promoIsSubmitting}
                    className={`rounded px-4 py-2 font-semibold text-white ${
                      !isCreateValid || promoIsSubmitting
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500"
                    }`}
                  >
                    {promoIsSubmitting ? "Saving Promotion..." : "Create Promotion"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* EMAIL PROMOTION SECTION (still frontend-only) */}
        <section className="rounded-2xl border bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setEmailOpen((v) => !v)}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
            aria-expanded={emailOpen}
            aria-controls="email-panel"
          >
            <div>
              <div className="text-lg font-semibold text-gray-900">Email Promotion</div>
              <div className="text-sm text-gray-600">Send to subscribed users only</div>
            </div>
            <svg
              className={`h-5 w-5 text-gray-700 transition-transform ${
                emailOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.94 1.17l-4.2 3.33a.75.75 0 01-.94 0l-4.2-3.33a.75.75 0 01-.08-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div
            id="email-panel"
            className={`grid overflow-hidden transition-all duration-300 ${
              emailOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0">
              <div className="border-t px-6 py-6 grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject *</label>
                  <input
                    className="mt-1 w-full rounded border border-gray-300 p-2"
                    value={emailForm.subject}
                    onChange={(e) =>
                      setEmailForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    placeholder="This weekend only: SAVE 10%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Message *</label>
                  <textarea
                    className="mt-1 w-full rounded border border-gray-300 p-2 min-h-28"
                    value={emailForm.message}
                    onChange={(e) =>
                      setEmailForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Write your promotional email message here…"
                  />
                </div>

                <div className="max-w-sm">
                  <label className="block text-sm font-medium text-gray-700">
                    Promo Code (optional)
                  </label>
                  <input
                    className="mt-1 w-full rounded border border-gray-300 p-2"
                    value={emailForm.promoCode}
                    onChange={(e) =>
                      setEmailForm((f) => ({
                        ...f,
                        promoCode: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="SAVE10"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                    checked
                    readOnly
                  />
                  <div>
                    <div className="text-sm text-gray-800">
                      Send only to subscribed users
                    </div>
                    <div className="text-xs text-gray-500">
                      This is enforced and cannot be changed.
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={submitEmail}
                    className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
                  >
                    Send Email
                  </button>
                  <button
                    type="button"
                    className="rounded border border-gray-300 px-4 py-2 font-semibold hover:bg-gray-50"
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
        </section>
      </div>
    </div>
  );
}
