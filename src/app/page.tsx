"use client";

import { useState, useEffect } from "react";

interface Item {
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
  const counts: Record<string, number> = {};
  sellers.forEach((s) => {
    counts[s] = items.filter((i) => i.seller === s).length;
  });

  const visible = selectedSeller ? items.filter((i) => i.seller === selectedSeller) : items;
  const merchantCount = sellers.length;
  const orderCount = selectedSeller ? visible.length : items.length;

  const load = async () => {
    const res = await fetch("/api/produce");
    const data: Item[] = await res.json();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="bg-orange-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-right">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">כל ההזמנות</h2>
          <p className="text-gray-600">
            {merchantCount} סוחרים • {orderCount} הזמנות
          </p>
        </div>

        {visible.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="text-6xl mb-6">🍑</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">עדיין אין חממונות</h3>
            <p className="text-gray-600">לחץ על "הזמנה חדשה" כדי להתחיל</p>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="flex-1 bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">שולם</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">סכום</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">מחיר סופי</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">מחיר משוער</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">יעד</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">משקל</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">תעודה</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">גודל</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">זן</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">ארגזים</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">סוחר</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">תאריך</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {visible.map((item) => (
                    <tr key={(item as any)._id || JSON.stringify(item)}>
                      <td className="px-4 py-2 text-sm"><button className="text-red-500">🗑</button> <button className="text-orange-500">✏</button></td>
                      <td className="px-4 py-2 text-sm">{(item as any).paid ? "כן" : "לא"}</td>
                      <td className="px-4 py-2 text-sm">{(item as any).paid ? `₪${(item as any).payment || 0}` : "-"}</td>
                      <td className="px-4 py-2 text-sm font-bold text-orange-700">₪{((item as any).finalPrice || 0).toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm">₪{((item as any).estimatedPrice || 0).toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm">{(item as any).destination || "-"}</td>
                      <td className="px-4 py-2 text-sm">{(item as any).weight || "-"}</td>
                      <td className="px-4 py-2 text-sm">{(item as any).deliveryNote || "-"}</td>
                      <td className="px-4 py-2 text-sm">{(item as any).size || "-"}</td>
                      <td className="px-4 py-2 text-sm">{(item as any).variety || "-"}</td>
                      <td className="px-4 py-2 text-sm">{(item as any).crates || "-"}</td>
                      <td className="px-4 py-2 text-sm">{(item as any).seller || "-"}</td>
                      <td className="px-4 py-2 text-sm">{(item as any).date || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sellers.length > 0 && (
              <div className="w-56 space-y-2">
                <button onClick={() => setSelectedSeller(null)} className={`w-full px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${selectedSeller === null ? "bg-orange-500 text-white" : "bg-white text-orange-700 border border-orange-500"}`}>
                  <span className="inline-flex w-5 h-5 text-xs items-center justify-center rounded-full bg-white text-gray-900 font-bold">{items.length}</span>
                  כל הסוחרים
                </button>
                {sellers.map((s) => (
                  <button key={s} onClick={() => setSelectedSeller(s)} className={`w-full px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${selectedSeller === s ? "bg-orange-500 text-white" : "bg-white text-orange-700 border border-orange-500"}`}>
                    <span className={`inline-flex w-5 h-5 text-xs items-center justify-center rounded-full font-bold ${selectedSeller === s ? "bg-white text-orange-500" : "bg-white text-gray-900"}`}>{counts[s]}</span>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
