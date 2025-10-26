export interface Appointment {
  id: string;

  patientId: string;
  patientName: string; // 

  doctorId: string;
  doctorName: string;

  schedule: Date;
  status: "scheduled" | "pending" | "cancelled";

  reason?: string | null;
  note?: string | null;
  cancellationReason?: string | null;

  createdAt?: Date | null;
}


