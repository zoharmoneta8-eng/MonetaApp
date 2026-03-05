"use client";

import { useState, useEffect } from "react";
import Header, { type View } from "./components/Header";
import OrdersView, { type Item } from "./components/OrdersView";
import NewOrderForm from "./components/NewOrderForm";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("orders");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/produce")
      .then((res) => res.json())
      .then((data: Item[]) => setItems(data));
  }, []);

  const handleOrderSaved = (newItem: Item) => {
    setItems((prev) => {
      if (prev.some((i) => i._id === newItem._id)) return prev;
      return [...prev, newItem];
    });
  };

  return (
    <>
      <Header activeView={activeView} onViewChange={setActiveView} />
      {activeView === "orders" ? (
        <OrdersView items={items} setItems={setItems} />
      ) : (
        <NewOrderForm onOrderSaved={handleOrderSaved} onNavigateToOrders={() => setActiveView("orders")} />
      )}
    </>
  );
}
