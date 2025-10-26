"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import SubmitButton from "../submit-button";

export const PatientForm = () => {
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  const handleContinue = () => {
    if (isSignedIn) {
      router.push(`/patients/${user?.id}/register`);
    } else {
      router.push(`/sign-in`);
    }
  };

  return (
    <div className="space-y-6">
      <section className="mb-12 space-y-4">
        <h1 className="header">Hi there 👋</h1>
        <p className="text-dark-700">
          Sign in to start managing your appointments.
        </p>
      </section>

      <SubmitButton isLoading={false} onClick={handleContinue}>
        {isSignedIn ? "Continue" : "Sign In to Start"}
      </SubmitButton>
    </div>
  );
};
