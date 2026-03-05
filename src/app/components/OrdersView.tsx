"use client";

import { useState, useEffect } from "react";

export interface Item {
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

interface OrdersViewProps {
  apiEndpoint: string;
}

const TH = "px-8 py-4 text-right text-sm font-semibold text-gray-500";
const TD = "px-8 py-5 text-right text-base text-gray-800";

export default function OrdersView({ apiEndpoint }: OrdersViewProps) {
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
    const res = await fetch(apiEndpoint);
    const data: Item[] = await res.json();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const renderRow = (item: Item) => (
    <tr key={item._id || JSON.stringify(item)} className="hover:bg-orange-50/40 transition-colors">
      <td className={TD}>
        <div className="flex items-center gap-3">
          <button className="text-orange-500 hover:text-orange-700 text-lg" title="עריכה">✏️</button>
          <button className="text-red-400 hover:text-red-600 text-lg" title="מחיקה">🗑️</button>
        </div>
      </td>
      <td className={TD}>{item.date || "-"}</td>
      <td className={`${TD} font-semibold`}>{item.crates || "-"}</td>
      <td className={TD}>{item.variety || "-"}</td>
      <td className={TD}>{item.size || "-"}</td>
      <td className={TD}>₪{(item.estimatedPrice || 0).toFixed(0)}</td>
      <td className={`${TD} font-bold text-orange-700`}>₪{(item.finalPrice || 0).toFixed(0)}</td>
      <td className={TD}>{item.paid ? `₪${item.payment || 0}` : "—"}</td>
      <td className={TD}>{item.deliveryNote || "-"}</td>
    </tr>
  );

  const tableHead = (
    <thead className="bg-gray-50/80">
      <tr>
        <th className={TH}>פעולות</th>
        <th className={TH}>תאריך</th>
        <th className={TH}>ארגזים</th>
        <th className={TH}>זן</th>
        <th className={TH}>גודל</th>
        <th className={TH}>מחיר מוסכם ₪</th>
        <th className={TH}>מחיר סופי ₪</th>
        <th className={TH}>מס ₪</th>
        <th className={TH}>תעודת משלוח</th>
      </tr>
    </thead>
  );

  return (
    <main className="bg-orange-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">כל ההזמנות</h2>
            <p className="text-gray-500 text-base">
              {merchantCount} סוחרים • {orderCount} הזמנות
            </p>
          </div>
          
          {sellers.length > 0 && visible.length > 0 && (
            <div className="flex flex-row-reverse items-center gap-3">
              {sellers.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSeller(selectedSeller === s ? null : s)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedSeller === s
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-white text-orange-700 border border-orange-300 hover:border-orange-500 hover:bg-orange-50"
                  }`}
                >
                  <span className={`inline-flex w-6 h-6 text-xs items-center justify-center rounded-full font-bold ${
                    selectedSeller === s ? "bg-white text-orange-500" : "bg-orange-100 text-orange-700"
                  }`}>
                    {counts[s]}
                  </span>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {visible.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div className="text-7xl mb-6">🍑</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">עדיין אין הזמנות</h3>
            <p className="text-gray-500 text-lg">לחץ על "הזמנה חדשה" כדי להתחיל</p>
          </div>
        ) : (
          <>
            {selectedSeller ? (
              <div className="bg-white rounded-2xl shadow-sm overflow-x-auto border border-gray-100">
                <table className="w-full divide-y divide-gray-100">
                  {tableHead}
                  <tbody className="divide-y divide-gray-100">
                    {visible.map(renderRow)}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                {sellers.map((s) => {
                  const groupItems = items.filter((i) => i.seller === s);
                  const grpCrates = groupItems.reduce((a, i) => a + (i.crates || 0), 0);
                  const grpPrice = groupItems.reduce((a, i) => a + (i.finalPrice || 0), 0);

                  return (
                    <div key={s} className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="flex justify-between items-center bg-orange-50 px-8 py-4 border-b border-orange-100">
                        <div className="flex items-center gap-3 text-lg font-bold text-gray-900">
                          {groupItems.length} הזמנות
                          <span className="inline-flex items-center justify-center w-7 h-7 text-xs rounded-full bg-orange-500 text-white font-bold">
                            {groupItems.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-base font-semibold text-orange-700">
                          <span>🧺 {grpCrates} ארגזים</span>
                          <span>💰 ₪{grpPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-100">
                          {tableHead}
                          <tbody className="divide-y divide-gray-100">
                            {groupItems.map(renderRow)}
                          </tbody>
                          <tfoot>
                            <tr className="font-bold bg-orange-50/60 text-base">
                              <td className="px-8 py-4 text-right text-gray-700">סה"כ</td>
                              <td />
                              <td className="px-8 py-4 text-right text-gray-900">{grpCrates}</td>
                              <td /><td /><td />
                              <td className="px-8 py-4 text-right text-orange-700">₪{grpPrice.toFixed(2)}</td>
                              <td /><td />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
