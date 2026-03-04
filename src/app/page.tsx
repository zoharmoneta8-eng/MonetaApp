"use client";

import { useState, useEffect } from "react";

interface Item {
  _id?: string;
  name: string;
  qty: number;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState(0);

  const load = async () => {
    const res = await fetch("/api/produce");
    const data: Item[] = await res.json();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    await fetch("/api/produce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, qty }),
    });
    setName("");
    setQty(0);
    load();
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">יישום חקלאות</h1>
      <div className="mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="שם"
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          placeholder="כמות"
          className="border p-2 w-full mb-2"
        />
        <button onClick={add} className="bg-blue-500 text-white px-4 py-2">
          הוסף
        </button>
      </div>
      <ul>
        {items.map((i) => (
          <li key={i._id || i.name}>
            {i.name}: {i.qty}
          </li>
        ))}
      </ul>
    </div>
  );
}
