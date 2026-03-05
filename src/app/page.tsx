"use client";

import { useState } from "react";
import Header, { type View } from "./components/Header";
import OrdersView from "./components/OrdersView";
import NewOrderForm from "./components/NewOrderForm";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("orders");

  return (
    <>
      <Header activeView={activeView} onViewChange={setActiveView} />
      {activeView === "orders" ? (
        <OrdersView apiEndpoint="/api/produce" />
      ) : (
        <NewOrderForm onOrderSaved={() => setActiveView("orders")} />
      )}
    </>
  );
}
