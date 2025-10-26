"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

const Home = () => {
  const { user, isSignedIn } = useUser();

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          {isSignedIn ? (
            <div className="space-y-8">
              <h2 className="header">Welcome back 👋</h2>

              <Link href={`/patients/${user?.id}/register`}>
                <p className="text-green-500 underline">
                  Continue to registration →
                </p>
              </Link>

              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="header">Welcome 👋</h2>
              <p className="text-dark-700">
                Sign in to continue with your healthcare.
              </p>

              <Link href="/sign-in">
                <p className="text-green-500 underline">Sign in / Register →</p>
              </Link>
            </div>
          )}

          <p className="text-14-regular mt-20 text-dark-600">
            © 2024 CarePulse
          </p>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient onboarding"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Home;
