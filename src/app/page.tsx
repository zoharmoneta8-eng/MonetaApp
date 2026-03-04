"use client";

import { useState, useEffect } from "react";

interface Item {
  // generic order representation; fields may vary
  _id?: string;
  date?: string;
  seller?: string;
  crates?: number;
  variety?: string;
  size?: string;
  estimatedPrice?: number;
  finalPrice?: number;
  deliveryNote?: string;
  destination?: string;
  weight?: number;
  paid?: boolean;
  payment?: number;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  
  const sellers = Array.from(new Set(items.map(i => i.seller).filter(Boolean))) as string[];
  const visible = selectedSeller ? items.filter(i => i.seller === selectedSeller) : items;
  const totalCrates = visible.reduce((acc, i) => acc + (i.crates || 0), 0);
  const totalPrice = visible.reduce((acc, i) => acc + (i.finalPrice || 0), 0);

  const load = async () => {
    const res = await fetch("/api/produce");
    const data: Item[] = await res.json();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 text-right">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">כל ההזמנות</h2>
        <p className="text-gray-600">
          {visible.length} הזמנות • {totalCrates} ארגזים
        </p>
      </div>

      {/* Empty State */}
      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="text-6xl mb-6">🍑</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">עדיין אין חממונות</h3>
          <p className="text-gray-600">
            לחץ על "הזמנה חדשה" כדי להתחיל
          </p>
        </div>
      ) : (
        <>
          {/* totals bar */}
          <div className="mb-4 flex justify-between items-center">
            <div className="text-orange-700 font-semibold">
              ₪{totalPrice.toFixed(2)}   {totalCrates} ארגזים
            </div>
          </div>
          {/* seller filter */}
          {sellers.length > 0 && (
          <div className="mb-4 flex gap-2 justify-end">
            <button
              className={`px-4 py-2 rounded-full font-medium ${selectedSeller===null?"bg-orange-500 text-white":"bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              onClick={()=>setSelectedSeller(null)}
            >
              כל הסוחרים
            </button>
            {sellers.map(s => (
              <button
                key={s}
                className={`px-4 py-2 rounded-full font-medium ${selectedSeller===s?"bg-orange-500 text-white":"bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                onClick={()=>setSelectedSeller(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">תאריך</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">סוחר</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ארגזים</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">זן</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">משקל</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שולם</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visible.map((item) => (
                <tr key={(item as any)._id || JSON.stringify(item)}>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-800 text-sm">{(item as any).date || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-800 text-sm">{(item as any).seller || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-800 text-sm">{(item as any).crates || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-800 text-sm">{(item as any).variety || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-800 text-sm">{(item as any).weight || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-800 text-sm">
                    {(item as any).paid ? "כן" : "לא"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </main>
  );
}
