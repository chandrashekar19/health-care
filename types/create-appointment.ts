export interface CreateAppointmentParams {
  patient: string; // patientId
  primaryPhysician: string; // doctorId
  schedule: Date;
  reason: string;
  status: "pending" | "scheduled" | "cancelled";
  note?: string | null;
}
