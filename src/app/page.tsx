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
        /* Items List - We'll implement this later */
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item._id || item.name} className="p-4 flex justify-between items-center">
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="text-gray-600">{item.qty} יחידות</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
