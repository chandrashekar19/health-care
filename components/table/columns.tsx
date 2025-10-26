"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime } from "@/lib/utils";
import { StatusBadge } from "../StatusBadge";
import { Appointment } from "@/types/appointment";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: ({ row }) => {
      const a = row.original;
      return <p className="text-14-medium">{a.patientName}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "doctorName",
    header: "Doctor",
    cell: ({ row }) => (
      <p className="whitespace-nowrap">Dr. {row.original.doctorName}</p>
    ),
  },
];
