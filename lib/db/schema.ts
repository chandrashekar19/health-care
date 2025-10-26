import { pgTable, uuid, varchar, timestamp, text, boolean, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// USERS - Clerk identity + roles
export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  clerkUserId: varchar("clerk_user_id").notNull().unique(),
  role: varchar("role").notNull().default("patient"),
  createdAt: timestamp("created_at").defaultNow(),
});

// PATIENTS - Full medical record profile 
export const patients = pgTable("patients", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),

  fullName: varchar("full_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),

  birthDate: varchar("birth_date").notNull(), //  store ISO string
  gender: varchar("gender", { enum: ["male", "female", "other"] }).notNull(),
  address: text("address").notNull(),
  occupation: varchar("occupation"),

  emergencyContactName: varchar("emergency_contact_name"),
  emergencyContactNumber: varchar("emergency_contact_number"),

  insuranceProvider: varchar("insurance_provider"),
  insurancePolicyNumber: varchar("insurance_policy_number"),

  allergies: text("allergies"),
  currentMedication: text("current_medication"),
  familyMedicalHistory: text("family_medical_history"),
  pastMedicalHistory: text("past_medical_history"),

  identificationType: varchar("identification_type"),
  identificationNumber: varchar("identification_number"),
  identificationDocumentUrl: text("identification_document_url"),

  treatmentConsent: boolean("treatment_consent").notNull(),
  disclosureConsent: boolean("disclosure_consent").notNull(),
  privacyConsent: boolean("privacy_consent").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});


// DOCTORS
export const doctors = pgTable("doctors", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  fullName: varchar("full_name").notNull(),
  specialty: varchar("specialty").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// APPOINTMENTS - Fully matched to Zod ✅
export const appointments = pgTable("appointments", {
  id: uuid().primaryKey().defaultRandom(),
  patientId: uuid("patient_id").notNull().references(() => patients.id),
  doctorId: uuid("doctor_id").notNull().references(() => doctors.id),
  scheduledAt: timestamp("scheduled_at").notNull(),

  reason: text("reason"),
  note: text("note"),
  cancellationReason: text("cancellation_reason"),

  status: varchar("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow(),
});

// RELATIONS
export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, { fields: [patients.userId], references: [users.id] }),
  appointments: many(appointments),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, { fields: [doctors.userId], references: [users.id] }),
  appointments: many(appointments),
}));
