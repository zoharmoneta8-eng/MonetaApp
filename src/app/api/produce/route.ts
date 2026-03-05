import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const memoryStore: any[] = [];

async function getCollection() {
  const client = await clientPromise;
  return client.db("farm").collection("produce");
}

export async function GET() {
  if (process.env.MONGODB_URI) {
    const col = await getCollection();
    const items = await col.find().toArray();
    return NextResponse.json(items);
  }
  return NextResponse.json(memoryStore);
}

export async function POST(request: Request) {
  const data = await request.json();

  if (process.env.MONGODB_URI) {
    const col = await getCollection();
    const result = await col.insertOne(data);
    return NextResponse.json({ ...data, _id: result.insertedId });
  }

  const id = String(memoryStore.length);
  const item = { ...data, _id: id };
  memoryStore.push(item);
  return NextResponse.json(item);
}

export async function PUT(request: Request) {
  const { _id, ...fields } = await request.json();
  if (!_id) {
    return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  }

  if (process.env.MONGODB_URI) {
    const col = await getCollection();
    await col.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
    return NextResponse.json({ _id, ...fields });
  }

  const idx = memoryStore.findIndex((i) => i._id === _id);
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  memoryStore[idx] = { ...memoryStore[idx], ...fields };
  return NextResponse.json(memoryStore[idx]);
}

export async function DELETE(request: Request) {
  const { _id } = await request.json();
  if (!_id) {
    return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  }

  if (process.env.MONGODB_URI) {
    const col = await getCollection();
    await col.deleteOne({ _id: new ObjectId(_id) });
    return NextResponse.json({ deleted: true });
  }

  const idx = memoryStore.findIndex((i) => i._id === _id);
  if (idx !== -1) memoryStore.splice(idx, 1);
  return NextResponse.json({ deleted: true });
}
