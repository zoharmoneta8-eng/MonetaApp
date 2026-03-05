"use client";

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from "react";
import { sellers as sellerOptions, varieties, sizes, destinations } from "@/lib/options";

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
  items: Item[];
  setItems: Dispatch<SetStateAction<Item[]>>;
}

const TH = "px-5 py-3 text-right text-sm font-semibold text-gray-500 whitespace-nowrap";
const TD = "px-5 py-4 text-right text-base text-gray-800";
const INPUT = "w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400";
const SELECT = "w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 bg-white";

function emptyItem(seller?: string): Item {
  return {
    date: new Date().toISOString().slice(0, 10),
    seller: seller || "",
    crates: 0,
    variety: "",
    size: "",
    estimatedPrice: 0,
    finalPrice: 0,
    deliveryNote: "",
    destination: "",
    weight: 0,
    paid: false,
    payment: 0,
  };
}

export default function OrdersView({ items, setItems }: OrdersViewProps) {
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Item>({});
  const [newRow, setNewRow] = useState<Item>(emptyItem());
  const [savingNew, setSavingNew] = useState(false);

  const sellers = Array.from(new Set(items.map((i) => i.seller).filter(Boolean))) as string[];
  const counts: Record<string, number> = {};
  sellers.forEach((s) => {
    counts[s] = items.filter((i) => i.seller === s).length;
  });

  const visible = selectedSeller ? items.filter((i) => i.seller === selectedSeller) : items;
  const merchantCount = sellers.length;
  const orderCount = selectedSeller ? visible.length : items.length;

  const startEdit = (item: Item) => {
    if (editingId === item._id) return;
    setEditingId(item._id || null);
    setEditData({ ...item });
  };

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditData({});
  }, []);

  const saveEdit = async () => {
    if (!editingId) return;
    const { _id, ...fields } = editData;
    const res = await fetch("/api/produce", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: editingId, ...fields }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((i) => (i._id === editingId ? { ...i, ...fields } : i))
      );
      cancelEdit();
    }
  };

  const deleteItem = async (id: string) => {
    const res = await fetch("/api/produce", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id }),
    });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i._id !== id));
    }
  };

  const saveNewRow = async (sellerOverride?: string) => {
    if (savingNew) return;
    setSavingNew(true);
    const payload = { ...newRow };
    if (sellerOverride) {
      payload.seller = sellerOverride;
    }
    const res = await fetch("/api/produce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const saved = await res.json();
      setItems((prev) => [...prev, saved]);
      setNewRow(emptyItem(sellerOverride || selectedSeller || ""));
    }
    setSavingNew(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelEdit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cancelEdit]);

  const updateEdit = (field: keyof Item, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNew = (field: keyof Item, value: any) => {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  };

  const renderEditableCell = (
    field: keyof Item,
    data: Item,
    onChange: (field: keyof Item, value: any) => void
  ) => {
    const val = data[field];
    switch (field) {
      case "date":
        return <input type="date" className={INPUT} value={(val as string) || ""} onChange={(e) => onChange(field, e.target.value)} />;
      case "seller":
        return (
          <select className={SELECT} value={(val as string) || ""} onChange={(e) => onChange(field, e.target.value)}>
            <option value="">...</option>
            {sellerOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        );
      case "variety":
        return (
          <select className={SELECT} value={(val as string) || ""} onChange={(e) => onChange(field, e.target.value)}>
            <option value="">...</option>
            {varieties.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        );
      case "size":
        return (
          <select className={SELECT} value={(val as string) || ""} onChange={(e) => onChange(field, e.target.value)}>
            <option value="">...</option>
            {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        );
      case "destination":
        return (
          <select className={SELECT} value={(val as string) || ""} onChange={(e) => onChange(field, e.target.value)}>
            <option value="">...</option>
            {destinations.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        );
      case "crates":
      case "weight":
      case "estimatedPrice":
      case "finalPrice":
        return (
          <input
            type="number"
            step={field === "crates" ? "1" : "0.01"}
            className={`${INPUT} w-20`}
            value={(val as number) || ""}
            onChange={(e) => onChange(field, Number(e.target.value))}
          />
        );
      default:
        return <input type="text" className={INPUT} value={(val as string) || ""} onChange={(e) => onChange(field, e.target.value)} />;
    }
  };

  const renderPaymentEdit = (
    data: Item,
    onChange: (field: keyof Item, value: any) => void
  ) => (
    <input
      type="number"
      step="0.01"
      className={`${INPUT} w-20`}
      value={data.payment || ""}
      placeholder="0"
      onChange={(e) => {
        const val = Number(e.target.value);
        onChange("payment", val);
        onChange("paid", val > 0);
      }}
    />
  );

  const renderRow = (item: Item) => {
    const isEditing = editingId === item._id;
    const data = isEditing ? editData : item;

    return (
      <tr
        key={item._id || JSON.stringify(item)}
        className={`transition-colors cursor-pointer ${
          isEditing ? "bg-orange-50 ring-1 ring-orange-200" : "hover:bg-orange-50/40"
        }`}
        onClick={() => !isEditing && startEdit(item)}
      >
        <td className={TD}>{isEditing ? renderEditableCell("date", data, updateEdit) : (item.date || "-")}</td>
        <td className={TD}>{isEditing ? renderEditableCell("crates", data, updateEdit) : (<span className="font-semibold">{item.crates || "-"}</span>)}</td>
        <td className={TD}>{isEditing ? renderEditableCell("variety", data, updateEdit) : (item.variety || "-")}</td>
        <td className={TD}>{isEditing ? renderEditableCell("size", data, updateEdit) : (item.size || "-")}</td>
        <td className={TD}>{isEditing ? renderEditableCell("estimatedPrice", data, updateEdit) : (`₪${(item.estimatedPrice || 0).toFixed(0)}`)}</td>
        <td className={`${TD} ${!isEditing ? "font-bold text-orange-700" : ""}`}>{isEditing ? renderEditableCell("finalPrice", data, updateEdit) : (`₪${(item.finalPrice || 0).toFixed(0)}`)}</td>
        <td className={TD}>{isEditing ? renderEditableCell("deliveryNote", data, updateEdit) : (item.deliveryNote || "-")}</td>
        <td className={TD}>{isEditing ? renderEditableCell("destination", data, updateEdit) : (item.destination || "-")}</td>
        <td className={TD}>{isEditing ? renderEditableCell("weight", data, updateEdit) : (item.weight || "-")}</td>
        <td className={TD}>
          {isEditing ? renderPaymentEdit(data, updateEdit) : (item.payment ? `₪${item.payment}` : "—")}
        </td>
        <td className={`${TD} text-center`}>
          {isEditing ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button onClick={saveEdit} className="text-green-600 hover:text-green-800 text-lg" title="שמור">✓</button>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 text-lg" title="ביטול">✕</button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); if (item._id) deleteItem(item._id); }}
              className="text-red-400 hover:text-red-600 text-lg"
              title="מחיקה"
            >
              🗑️
            </button>
          )}
        </td>
      </tr>
    );
  };

  const renderNewRow = (sellerForGroup?: string) => (
    <tr className="bg-green-50/40 border-t-2 border-dashed border-green-200">
      <td className={TD}>{renderEditableCell("date", newRow, updateNew)}</td>
      <td className={TD}>{renderEditableCell("crates", newRow, updateNew)}</td>
      <td className={TD}>{renderEditableCell("variety", newRow, updateNew)}</td>
      <td className={TD}>{renderEditableCell("size", newRow, updateNew)}</td>
      <td className={TD}>{renderEditableCell("estimatedPrice", newRow, updateNew)}</td>
      <td className={TD}>{renderEditableCell("finalPrice", newRow, updateNew)}</td>
      <td className={TD}>{renderEditableCell("deliveryNote", newRow, updateNew)}</td>
      <td className={TD}>{renderEditableCell("destination", newRow, updateNew)}</td>
      <td className={TD}>{renderEditableCell("weight", newRow, updateNew)}</td>
      <td className={TD}>{renderPaymentEdit(newRow, updateNew)}</td>
      <td className={`${TD} text-center`}>
        <button
          onClick={() => saveNewRow(sellerForGroup)}
          disabled={savingNew}
          className="text-green-600 hover:text-green-800 text-xl font-bold disabled:opacity-50"
          title="הוסף שורה"
        >
          +
        </button>
      </td>
    </tr>
  );

  const tableHead = (
    <thead className="bg-gray-50/80">
      <tr>
        <th className={TH}>תאריך</th>
        <th className={TH}>ארגזים</th>
        <th className={TH}>זן</th>
        <th className={TH}>גודל</th>
        <th className={TH}>מחיר משוער</th>
        <th className={TH}>מחיר סופי</th>
        <th className={TH}>תעודת משלוח</th>
        <th className={TH}>יעד</th>
        <th className={TH}>משקל</th>
        <th className={TH}>תשלום</th>
        <th className={`${TH} text-center w-16`}>מחיקה</th>
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
                  <span
                    className={`inline-flex w-6 h-6 text-xs items-center justify-center rounded-full font-bold ${
                      selectedSeller === s ? "bg-white text-orange-500" : "bg-orange-100 text-orange-700"
                    }`}
                  >
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
                    {renderNewRow(selectedSeller)}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                {sellers.map((s) => {
                  const groupItems = items.filter((i) => i.seller === s);
                  const grpCrates = groupItems.reduce((a, i) => a + (i.crates || 0), 0);
                  const grpPayment = groupItems.reduce((a, i) => a + (i.payment || 0), 0);

                  return (
                    <div key={s} className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="flex justify-between items-center bg-orange-50 px-8 py-4 border-b border-orange-100">
                        <div className="flex items-center gap-3 text-lg font-bold text-gray-900">
                          {s}
                          <span className="inline-flex items-center justify-center w-7 h-7 text-xs rounded-full bg-orange-500 text-white font-bold">
                            {groupItems.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-base font-semibold text-orange-700">
                          <span>🧺 {grpCrates} ארגזים</span>
                          <span>💰 ₪{grpPayment.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-100">
                          {tableHead}
                          <tbody className="divide-y divide-gray-100">
                            {groupItems.map(renderRow)}
                            {renderNewRow(s)}
                          </tbody>
                          <tfoot>
                            <tr className="font-bold bg-orange-50/60 text-base">
                              <td className="px-5 py-3 text-right text-gray-700">סה"כ</td>
                              <td className="px-5 py-3 text-right text-gray-900">{grpCrates}</td>
                              <td /><td /><td />
                              <td className="px-5 py-3 text-right text-orange-700">₪{grpPayment.toFixed(2)}</td>
                              <td /><td /><td /><td /><td />
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
