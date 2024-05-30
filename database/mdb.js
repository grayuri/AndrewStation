import { MongoClient } from "mongodb";

const URI = process.env.MONGODB_URI

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error("Please, add a URI inside the .env file.")
}

if (process.env.MONGODB_URI === "development") {
  if (global._mongoClientPromise) {
    client = new MongoClient(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
}
else {
  client = new MongoClient(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  clientPromise = client.connect()
}

export default clientPromise

