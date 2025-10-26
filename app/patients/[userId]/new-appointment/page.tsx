import AppointmentForm from "@/components/forms/appointment-form";
import { getPatient } from "@/lib/db/patient";
import Image from "next/image";
import Link from "next/link";

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  if (!patient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-16-semibold">Patient not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Link href="/">
            <Image
              src="/assets/icons/logo-full.svg"
              height={40}
              width={162}
              alt="logo"
              className="mb-12 h-10 w-fit"
            />
          </Link>

          {/* ✅ Use Drizzle patient.id */}
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.id}
          />

          <p className="copyright mt-10 py-12">© 2024 CarePulse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default NewAppointment;
