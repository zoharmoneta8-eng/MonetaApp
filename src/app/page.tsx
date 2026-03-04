"use client";

import { useState, useEffect } from "react";

interface Item {
  _id?: string;
  name: string;
  qty: number;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">כל החממונות</h2>
        <p className="text-gray-600">
          {items.length} חממונות • {items.reduce((sum, item) => sum + item.qty, 0)} סחורות
        </p>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="text-6xl mb-6">🍑</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">עדיין אין חממונות</h3>
          <p className="text-gray-600">
            לחץ על "הזמנה חדשה" כדי להתחיל
          </p>
        </div>
      ) : (
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
              {items.map((item) => (
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
      )}
    </main>
  );
}
