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
  
  // compute unique sellers and statistics
  const sellers = Array.from(new Set(items.map(i => i.seller).filter(Boolean))) as string[];

  // counts per seller (used for the filter buttons)
  const counts: Record<string, number> = {};
  sellers.forEach((s) => {
    counts[s] = items.filter((i) => i.seller === s).length;
  });

  // items currently visible according to filter
  const visible = selectedSeller ? items.filter((i) => i.seller === selectedSeller) : items;

  // overall totals (for header summary or totals bar)
  const totalCrates = visible.reduce((acc, i) => acc + (i.crates || 0), 0);
  const totalPrice = visible.reduce((acc, i) => acc + (i.finalPrice || 0), 0);

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
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 text-right">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">כל ההזמנות</h2>
        <p className="text-gray-600">
          {merchantCount} סוחרים • {orderCount} הזמנות
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${selectedSeller === null ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              onClick={() => setSelectedSeller(null)}
            >
              כל הסוחרים
            </button>
            {sellers.map((s) => (
              <button
                key={s}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${selectedSeller === s ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                onClick={() => setSelectedSeller(s)}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ${selectedSeller===s?"bg-orange-500 text-white":"bg-white text-gray-900"}`}>
                  {counts[s]}
                </span>
                {s}
              </button>
            ))}
          </div>
        )}
          {/* grouped tables by seller */}
          {(() => {
            // build groups map
            const groups: Record<string, Item[]> = {};
            (selectedSeller ? [selectedSeller] : sellers).forEach((s) => {
              groups[s] = items.filter((i) => i.seller === s);
            });

            return Object.entries(groups).map(([s, groupItems]) => {
              const grpCrates = groupItems.reduce((a, i) => a + (i.crates || 0), 0);
              const grpPrice = groupItems.reduce((a, i) => a + (i.finalPrice || 0), 0);
              return (
                <div key={s} className="mb-8 bg-white rounded-lg shadow">
                  {/* header bar for seller */}
                  <div className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-t-lg">
                    <div className="font-medium text-gray-800">{s}</div>
                    <div className="text-orange-700 font-semibold">
                      ₪{grpPrice.toFixed(2)}   {grpCrates} ארגזים
                    </div>
                  </div>

                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          תאריך
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ארגזים
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          זן
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          משקל
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          שולם
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupItems.map((item) => (
                        <tr key={(item as any)._id || JSON.stringify(item)}>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-800 text-sm">
                            {(item as any).date || "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-800 text-sm">
                            {(item as any).crates || "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-800 text-sm">
                            {(item as any).variety || "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-800 text-sm">
                            {(item as any).weight || "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-800 text-sm">
                            {(item as any).paid ? "כן" : "לא"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {groupItems.length > 0 && (
                      <tfoot>
                        <tr className="font-semibold bg-gray-50">
                          <td className="px-4 py-2 text-right">סה"כ</td>
                          <td className="px-4 py-2">{grpCrates}</td>
                          <td />
                          <td />
                          <td className="px-4 py-2">₪{grpPrice.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              );
            });
          })()}
        </>
      )}
    </main>
  );
}
