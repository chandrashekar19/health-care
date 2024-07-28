import * as sdk from "node-appwrite";
require("dotenv").config();

const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID!;
const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT!;

const client = new sdk.Client()
  .setEndpoint(ENDPOINT) // Your API Endpoint
  .setProject(PROJECT_ID) // Your project ID
  .setKey(API_KEY); // Your secret API key

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);

//  we are adding exclamanation marks to know that it exists.
