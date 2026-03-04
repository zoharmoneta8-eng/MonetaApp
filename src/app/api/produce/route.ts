import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("farm");
  const items = await db.collection("produce").find().toArray();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const data = await request.json();
  const client = await clientPromise;
  const db = client.db("farm");
  const result = await db.collection("produce").insertOne(data);
  return NextResponse.json({ insertedId: result.insertedId });
}
