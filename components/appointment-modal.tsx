"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AppointmentForm from "./forms/appointment-form";
import { Appointment } from "@/types/appointment";

interface AppointmentModalProps {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: "schedule" | "cancel";
}

export const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`${
            type === "schedule" ? "text-green-500" : "text-red-500"
          } capitalize`}
        >
          {type === "schedule" ? "Schedule" : "Cancel"}
        </Button>
      </DialogTrigger>

      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">
            {type === "schedule" ? "Schedule Appointment" : "Cancel Appointment"}
          </DialogTitle>
          <DialogDescription>
            {type === "schedule"
              ? "Confirm the appointment details to schedule."
              : "Provide a reason to cancel this appointment."}
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
