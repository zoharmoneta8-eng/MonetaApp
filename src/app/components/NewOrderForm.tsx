"use client";

import { useState } from "react";
import { sellers, varieties, sizes, destinations } from "@/lib/options";

interface NewOrderFormProps {
  onOrderSaved: () => void;
}

export default function NewOrderForm({ onOrderSaved }: NewOrderFormProps) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [seller, setSeller] = useState("");
  const [crates, setCrates] = useState(0);
  const [variety, setVariety] = useState("");
  const [size, setSize] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState(0);
  const [paid, setPaid] = useState(false);
  const [payment, setPayment] = useState(0);

  const [savedOrder, setSavedOrder] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = {
      date,
      seller,
      crates,
      variety,
      size,
      estimatedPrice,
      finalPrice,
      deliveryNote,
      destination,
      weight,
      paid,
      payment,
    };

    const res = await fetch("/api/produce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (res.ok) {
      setSavedOrder(order);
    }
  };

  if (savedOrder) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-orange-500 rounded-2xl text-center p-8 text-white mb-6">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold mt-4">ההזמנה נשמרה!</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <dl className="grid grid-cols-1 gap-4">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">שם הסוחר</dt>
              <dd className="text-gray-900">{savedOrder.seller}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">תאריך</dt>
              <dd className="text-gray-900">{savedOrder.date}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">כמות (ארגזים)</dt>
              <dd className="text-gray-900">{savedOrder.crates}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">זן</dt>
              <dd className="text-gray-900">{savedOrder.variety}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">גודל</dt>
              <dd className="text-gray-900">{savedOrder.size}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">מחיר משוער (₪)</dt>
              <dd className="text-gray-900">{savedOrder.estimatedPrice}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">מחיר סופי (₪)</dt>
              <dd className="text-gray-900">{savedOrder.finalPrice}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">תעודת משלוח</dt>
              <dd className="text-gray-900">{savedOrder.deliveryNote || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">יעד</dt>
              <dd className="text-gray-900">{savedOrder.destination}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">משקל (ק"ג)</dt>
              <dd className="text-gray-900">{savedOrder.weight}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">שולם</dt>
              <dd className="text-gray-900">{savedOrder.paid ? "כן" : "לא"}</dd>
            </div>
            {savedOrder.paid && (
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">סכום (₪)</dt>
                <dd className="text-gray-900">{savedOrder.payment}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={onOrderSaved}
              className="px-6 py-2 bg-gray-100 text-gray-800 rounded-full"
            >
              כל ההזמנות
            </button>
            <button
              onClick={() => setSavedOrder(null)}
              className="px-6 py-2 bg-orange-500 text-white rounded-full"
            >
              הזמנה חדשה
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-right mb-6">
        <h2 className="text-3xl font-bold text-gray-900">יצירת הזמנה חדשה</h2>
        <p className="text-gray-600">מלא את הפרטים ולחץ על שמור</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תאריך
            </label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם הסוחר
            </label>
            {/* <input
              type="text"
              className="w-full border rounded p-2"
              value={seller}
              onChange={(e) => setSeller(e.target.value)}
              placeholder="שם סוחר"
            /> */}
            <select
              className="w-full border rounded p-2"
              value={seller}
              onChange={(e) => setSeller(e.target.value)}
            >
              <option value="">בחר סוחר...</option>
              {sellers.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כמות (ארגזים)
            </label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={crates || ""}
              onChange={(e) => setCrates(Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              זן
            </label>
            <select
              className="w-full border rounded p-2"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
            >
              <option value="">בחר זן...</option>
              {varieties.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              גודל
            </label>
            <select
              className="w-full border rounded p-2"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">בחר גודל...</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מחיר משוער (₪)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full border rounded p-2"
              value={estimatedPrice || ""}
              onChange={(e) => setEstimatedPrice(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מחיר סופי (₪)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full border rounded p-2"
              value={finalPrice || ""}
              onChange={(e) => setFinalPrice(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            תעודת משלוח
          </label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={deliveryNote}
            onChange={(e) => setDeliveryNote(e.target.value)}
            placeholder="תעודת משלוח"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              יעד
            </label>
            <select
              className="w-full border rounded p-2"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">בחר יעד...</option>
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              משקל (ק"ג)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full border rounded p-2"
              value={weight || ""}
              onChange={(e) => setWeight(Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-orange-600"
              checked={paid}
              onChange={(e) => setPaid(e.target.checked)}
            />
            <span className="ml-2 text-gray-700">שולם</span>
          </label>
          {paid && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סכום (₪)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded p-2"
                value={payment || ""}
                onChange={(e) => setPayment(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white rounded-lg py-3 font-semibold hover:bg-orange-600"
        >
          שמור הזמנה
        </button>
      </form>
    </main>
  );
}
