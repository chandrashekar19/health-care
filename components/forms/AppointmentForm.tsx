"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { createAppointment, updateAppointment } from "@/lib/db/appointment";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appointment";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

interface AppointmentFormProps {
  userId: string;
  patientId: string;
  type?: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const doctorsList = [
  { id: "doc-1", name: "John Doe" },
  { id: "doc-2", name: "Maria Watson" },
  { id: "doc-3", name: "Alex Carter" },
]; // TODO: Replace with DB doctors later ✅

const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: AppointmentFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment?.doctorId || "",
      schedule: appointment?.schedule
        ? new Date(appointment.schedule)
        : new Date(),
      reason: appointment?.reason || "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    const status =
      type === "schedule"
        ? "scheduled"
        : type === "cancel"
        ? "cancelled"
        : "pending";

    try {
      if (type === "create") {
        const payload = {
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: values.schedule,
          reason: values.reason!,
          status: status as "pending" | "scheduled" | "cancelled",
          note: values.note || null,
        };

        const newAppointment = await createAppointment(payload);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.id}`
          );
        }
      } else {
        const payload = {
          appointmentId: appointment?.id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: values.schedule,
            status,
            cancellationReason: values.cancellationReason ?? "",
          },
          type,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          userId,
        };

        const updated = await updateAppointment(payload);

        if (updated) {
          setOpen?.(false);
          form.reset();
        }
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }

    setIsLoading(false);
  };

  const buttonLabel =
    type === "cancel"
      ? "Cancel Appointment"
      : type === "schedule"
      ? "Schedule Appointment"
      : "Submit Appointment";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in moments.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            {/* Doctor */}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {doctorsList.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  <p>Dr. {doctor.name}</p>
                </SelectItem>
              ))}
            </CustomFormField>

            {/* Date */}
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Appointment Date & Time"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            {/* Reason + Notes */}
            <div
              className={`flex flex-col gap-6 ${
                type === "create" && "xl:flex-row"
              }`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment Reason"
                placeholder="Ex: Follow-up checkup"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments / Notes"
                placeholder="Prefer afternoon timing"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
