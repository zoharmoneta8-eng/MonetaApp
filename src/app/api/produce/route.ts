import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// in-memory fallback when no database URI is provided
const memoryStore: any[] = [];

async function getItems() {
  if (process.env.MONGODB_URI) {
    const client = await clientPromise;
    const db = client.db("farm");
    return db.collection("produce").find().toArray();
  }
  return memoryStore;
}

async function addItem(data: any) {
  if (process.env.MONGODB_URI) {
    const client = await clientPromise;
    const db = client.db("farm");
    return db.collection("produce").insertOne(data);
  }
  memoryStore.push(data);
  return { insertedId: memoryStore.length - 1 };
}

export async function GET() {
  const items = await getItems();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const data = await request.json();
  const result = await addItem(data);
  return NextResponse.json({ insertedId: result.insertedId });
}
