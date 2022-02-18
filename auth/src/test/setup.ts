import {} from "jasmine";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose = require("mongoose");
import { app } from "../app";

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "43654Y654";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri =  mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
