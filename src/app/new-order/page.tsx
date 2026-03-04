"use client";

import { useState } from "react";
import { varieties, sizes, destinations } from "@/lib/options";
import { useRouter } from "next/navigation";

export default function NewOrder() {
  const router = useRouter();

  // form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [seller, setSeller] = useState("");
  const [crates, setCrates] = useState(0);
  const [variety, setVariety] = useState("");
  const [size, setSize] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState(0);
  const [paid, setPaid] = useState(false);
  const [payment, setPayment] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = {
      date,
      seller,
      crates,
      variety,
      size,
      estimatedPrice,
      tax,
      finalPrice,
      deliveryNote,
      destination,
      weight,
      paid,
      payment,
    };

    await fetch("/api/produce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    router.push("/");
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-right mb-6">
        <h2 className="text-3xl font-bold text-gray-900">יצירת הזמנה חדשה</h2>
        <p className="text-gray-600">מלא את הפרטים ולחץ על שמור</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow">
        {/* row 1: date + seller */}
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
            <input
              type="text"
              className="w-full border rounded p-2"
              value={seller}
              onChange={(e) => setSeller(e.target.value)}
              placeholder="הכנס שם סוחר"
            />
          </div>
        </div>

        {/* row 2: crates + variety + size */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כמות (ארגזים)
            </label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={crates}
              onChange={(e) => setCrates(Number(e.target.value))}
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

        {/* row 3: estimated price + tax + final price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מחיר משוער (₪)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full border rounded p-2"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מס (₪)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full border rounded p-2"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
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
              value={finalPrice}
              onChange={(e) => setFinalPrice(Number(e.target.value))}
            />
          </div>
        </div>

        {/* row 4: delivery note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            תעודת משלוח
          </label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={deliveryNote}
            onChange={(e) => setDeliveryNote(e.target.value)}
            placeholder="מספר תעודת משלוח"
          />
        </div>

        {/* row 5: destination + weight */}
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
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
        </div>

        {/* row 6: paid checkbox + payment amount */}
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
                value={payment}
                onChange={(e) => setPayment(Number(e.target.value))}
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
