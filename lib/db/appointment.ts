"use server";

import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { sendSMSNotification } from "@/lib/sms";
import { db } from ".";
import { appointments, patients, doctors } from "./schema";
import { Appointment } from "@/types/appointment";
import { CreateAppointmentParams } from "@/types/create-appointment";



// Create Appointment
export const createAppointment = async (data: CreateAppointmentParams) => {
  try {
    const created = await db.insert(appointments).values({
      patientId: data.patient,
      doctorId: data.primaryPhysician,
      scheduledAt: new Date(data.schedule),
      status: data.status ?? "scheduled",
      reason: data.reason ?? "",
      note: data.note ?? null,
    }).returning();

    revalidatePath("/admin");
    return created[0];
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// ✅ Get Recent Appointments (with doctor + patient name)
export const getRecentAppointmentList = async () => {
  try {
    const rows = await db
      .select({
        id: appointments.id,
        patientId: appointments.patientId,
        doctorId: appointments.doctorId,
        scheduledAt: appointments.scheduledAt,
        status: appointments.status,
        reason: appointments.reason,
        note: appointments.note,
        cancellationReason: appointments.cancellationReason,
        createdAt: appointments.createdAt,

        patientName: patients.fullName,
        doctorName: doctors.fullName,
      })
      .from(appointments)
      .innerJoin(patients, eq(appointments.patientId, patients.id))
      .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
      .orderBy(desc(appointments.createdAt));

    const docsUI: Appointment[] = rows.map((row) => ({
      id: row.id,
      patientId: row.patientId,
      patientName: row.patientName,
      doctorId: row.doctorId,
      doctorName: row.doctorName,
      schedule: row.scheduledAt,
      status: row.status as "scheduled" | "pending" | "cancelled",
      reason: row.reason,
      note: row.note,
      cancellationReason: row.cancellationReason,
      createdAt: row.createdAt,
    }));

    const counts = {
      scheduledCount: docsUI.filter(a => a.status === "scheduled").length,
      pendingCount: docsUI.filter(a => a.status === "pending").length,
      cancelledCount: docsUI.filter(a => a.status === "cancelled").length,
    };

    return {
      totalCount: docsUI.length,
      ...counts,
      documents: docsUI,
    };
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    return {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
      totalCount: 0,
      documents: [],
    };
  }
};

// ✅ Update Appointment
export const updateAppointment = async ({
  appointmentId,
  appointment,
  type,
  userId,
}: UpdateAppointmentParams) => {
  try {
    const updated = await db
      .update(appointments)
      .set({
        scheduledAt: new Date(appointment.schedule),
        status: appointment.status,
        note: appointment.note ?? null,
        cancellationReason: appointment.cancellationReason ?? null,
      })
      .where(eq(appointments.id, appointmentId))
      .returning();

    if (!updated[0]) throw new Error("Appointment not found");

    const message =
      type === "schedule"
        ? `Your appointment is confirmed for ${appointment.schedule}`
        : `Your appointment on ${appointment.schedule} is cancelled. Reason: ${appointment.cancellationReason}`;

    await sendSMSNotification(userId, message);

    revalidatePath("/admin");
    return updated[0];
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

//  Get Appointment by ID

export const getAppointment = async (appointmentId: string) => {
  try {
    const rows = await db
      .select({
        id: appointments.id,
        patientId: appointments.patientId,
        doctorId: appointments.doctorId,
        scheduledAt: appointments.scheduledAt,
        reason: appointments.reason,
        note: appointments.note,
        cancellationReason: appointments.cancellationReason,
        status: appointments.status,
        createdAt: appointments.createdAt,

        patientName: patients.fullName,
        doctorName: doctors.fullName,
      })
      .from(appointments)
      .innerJoin(patients, eq(appointments.patientId, patients.id))
      .innerJoin(doctors, eq(appointments.doctorId, doctors.id))
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    return {
      id: row.id,
      patientId: row.patientId,
      patientName: row.patientName,
      doctorId: row.doctorId,
      doctorName: row.doctorName,
      schedule: row.scheduledAt, //  renaming for UI consistency
      status: row.status as "scheduled" | "pending" | "cancelled",
      reason: row.reason,
      note: row.note,
      cancellationReason: row.cancellationReason,
      createdAt: row.createdAt,
    } satisfies Appointment;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
};
