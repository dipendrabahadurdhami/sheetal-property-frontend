"use client";

import { useState } from "react";

export default function RequirementPaymentModal({
  open,
  onClose,
  requirementId,
  payment,
  apiBase,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [reference, setReference] = useState(payment?.reference || "");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async () => {
    if (!file) {
      setError("Please attach a payment screenshot.");
      return;
    }
    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.append("payment_proof", file);
    if (reference) fd.append("payment_reference", reference);

    try {
      const res = await fetch(
        `${apiBase}/api/requirement-form/${requirementId}/payment-proof`,
        { method: "POST", body: fd }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Upload failed");
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-lg font-semibold">
            {done ? "Submitted ✓" : "Complete Payment"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {!done && (
          <div className="p-5 space-y-4">
            {payment?.qr_code_url ? (
              <div className="flex flex-col items-center">
                <img
                  src={payment.qr_code_url}
                  alt="Payment QR"
                  className="h-52 w-52 rounded border bg-white p-2 object-contain"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Scan with eSewa / Khalti / your banking app
                </p>
              </div>
            ) : (
              <div className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                QR not uploaded by admin yet. Please transfer manually using the bank details below.
              </div>
            )}

            <div className="rounded-lg bg-gray-50 p-3 text-sm">
              <div className="grid grid-cols-3 gap-1">
                <span className="text-gray-500">Bank</span>
                <span className="col-span-2 font-medium">{payment?.bank_name}</span>
                <span className="text-gray-500">A/C</span>
                <span className="col-span-2 font-mono font-medium">{payment?.account_number}</span>
                <span className="text-gray-500">Name</span>
                <span className="col-span-2 font-medium">{payment?.account_name}</span>
                <span className="text-gray-500">Amount</span>
                <span className="col-span-2 font-semibold text-emerald-700">
                  NPR {payment?.fee_amount}
                </span>
                <span className="text-gray-500">Ref.</span>
                <span className="col-span-2 font-mono">{reference}</span>
              </div>
            </div>

            {payment?.instructions && (
              <p className="text-xs text-gray-600 whitespace-pre-line">{payment.instructions}</p>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Screenshot <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onPick}
                className="block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-2"
              />
              {preview && (
                <img src={preview} alt="preview" className="mt-2 max-h-32 rounded border" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Reference / Transaction ID (optional)
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. TXN-1234567"
                className="w-full rounded border px-3 py-2 text-sm"
              />
            </div>

            {error && (
              <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              onClick={onSubmit}
              disabled={uploading || !file}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Submit Screenshot"}
            </button>
          </div>
        )}

        {done && (
          <div className="p-6 text-center">
            <div className="text-5xl">✅</div>
            <h4 className="mt-2 text-lg font-semibold">Screenshot received!</h4>
            <p className="mt-1 text-sm text-gray-600">
              Admin will verify and contact you within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-white text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}