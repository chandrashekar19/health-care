import Image from "next/image";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/forms/register-form";
import { getPatient } from "@/lib/db/patient";
import Link from "next/link";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  if (patient) {
    redirect(`/patients/${userId}/new-appointment`);
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Link href="/">
            <Image
              src="/assets/icons/logo-full.svg"
              height={40}
              width={162}
              alt="carepulse logo"
              className="mb-12 h-10 w-fit"
            />
          </Link>

          <RegisterForm userId={userId} />

          <p className="copyright py-12">
            © 2024 CarePulse
          </p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient registration"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
