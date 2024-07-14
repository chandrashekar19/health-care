import * as sdk from 'node-appwrite';

// Load environment variables from .env file
require('dotenv').config();

export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

// Verify that environment variables are loaded
console.log('ENDPOINT:', ENDPOINT);
console.log('PROJECT_ID:', PROJECT_ID);
console.log('API_KEY:', API_KEY);

const client = new sdk.Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject('66934fb7002700f5b16f') // Your project ID
  .setKey(
    'b3c4a38b2467c536e51220f3df923a5fa4f11f5a6cae7d3e11d925b2145d82022ddc0f34e23534e08f46da6f1b2be243c248cbe5e803f1e27658656b585569a66376439353e8df29da2a664b6409ec03e32c1a0e2ec810a523afd92fc3f7d84d0340bf83a17dd36cc2b339f46fa4163836eeb648725d86e9cb5d09fc59ab2c5d'
  ); // Your secret API key

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
console.log('USERS', users);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);

//  we are adding exclamanation marks to know that it exists.
