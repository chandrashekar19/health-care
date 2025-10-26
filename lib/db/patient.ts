"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from ".";
import { patients, users } from "./schema";
import { RegisterUserParams } from "@/types/user";

async function uploadIdentificationFile(_: any) {
  return { url: null, fileId: null };
}

//  CREATE Clerk + DB User
export const createUser = async (user: CreateUserParams) => {
  const client = await clerkClient();
  const newUser = await client.users.createUser({
    emailAddress: [user.email],
    phoneNumber: [user.phone],
    firstName: user.name,
  });

  const dbUser = await db.insert(users)
    .values({
      clerkUserId: newUser.id,
      role: "patient",
    }).returning();

  return dbUser[0];
};

//  REGISTER PATIENT WITH FULL MEDICAL PROFILE


export const registerPatient = async ({
  identificationDocument,
  ...data
}: RegisterUserParams) => {
  try {
    const fileUpload = await uploadIdentificationFile(identificationDocument);

    const result = await db.insert(patients).values({
      userId: data.userId,
      fullName: data.name,
      email: data.email,
      phone: data.phone,

      //  Fix
      birthDate: new Date(data.birthDate).toISOString().split("T")[0],
      gender: data.gender,
      address: data.address,
      occupation: data.occupation,

      emergencyContactName: data.emergencyContactName,
      emergencyContactNumber: data.emergencyContactNumber,

      insuranceProvider: data.insuranceProvider,
      insurancePolicyNumber: data.insurancePolicyNumber,

      allergies: data.allergies ?? null,
      currentMedication: data.currentMedication ?? null,
      familyMedicalHistory: data.familyMedicalHistory ?? null,
      pastMedicalHistory: data.pastMedicalHistory ?? null,

      identificationType: data.identificationType ?? null,
      identificationNumber: data.identificationNumber ?? null,
      identificationDocumentUrl: fileUpload.url,

      // Now exists in both schema and type
      treatmentConsent: data?.treatmentConsent,
      disclosureConsent: data.disclosureConsent,
      privacyConsent: data.privacyConsent,
    }).returning();

    revalidatePath("/patients");
    return result[0];
  } catch (error) {
    console.error("Error registering patient:", error);
    throw error;
  }
};



//  FIND PATIENT RECORD
export const getPatient = async (userId: string) => {
  const res = await db
    .select()
    .from(patients)
    .where(eq(patients.userId, userId))
    .limit(1);

  return res[0] ?? null;
};
