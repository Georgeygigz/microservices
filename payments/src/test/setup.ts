import {} from "jasmine";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose = require("mongoose");
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  function signin(id?:string): string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "43654Y654";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload. {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session to JSON
  const sessionJson = JSON.stringify(session);

  // Take JSON an encode it as base64
  const base64 = Buffer.from(sessionJson).toString("base64");

  // return a string thats the cookie with th encoded data
  return [`express:sess=${base64}`];
};
