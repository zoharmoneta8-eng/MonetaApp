import { MongoClient } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const uri = process.env.MONGODB_URI;

// If no URI is provided, create a dummy promise that will never resolve
// The API route will check for MONGODB_URI before using this
if (!uri) {
  clientPromise = new Promise(() => {
    // Never resolves - this is intentional as it won't be used if MONGODB_URI is not set
  });
} else {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so the value is preserved across module reloads
    // This prevents creating multiple connections during hot reloads
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(uri);
      (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export default clientPromise;
