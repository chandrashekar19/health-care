"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";

import { Form, FormControl } from "@/components/ui/form";
import { PatientFormValidation } from "@/lib/validation";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { FileUploader } from "../FileUploader";
import { registerPatient } from "@/lib/db/patient";

interface RegisterFormProps {
  userId: string;
}

const RegisterForm = ({ userId }: RegisterFormProps) => {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const email = user?.emailAddresses[0]?.emailAddress || "";
  const name = user?.firstName || "";
  const phone = user?.phoneNumbers[0]?.phoneNumber || "";

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name,
      email,
      phone,
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    let fileData: FormData | null = null;
    if (values.identificationDocument?.length) {
      const file = values.identificationDocument[0];
      fileData = new FormData();
      fileData.append("blobFile", file);
      fileData.append("fileName", file.name);
    }

    const payload = {
      userId,
      name: values.name,
      email: values.email,
      phone: values.phone,
      birthDate: new Date(values.birthDate).toISOString().split("T")[0],
      gender: values.gender,
      address: values.address,
      occupation: values.occupation,
      emergencyContactName: values.emergencyContactName,
      emergencyContactNumber: values.emergencyContactNumber,
      insuranceProvider: values.insuranceProvider,
      insurancePolicyNumber: values.insurancePolicyNumber,
      allergies: values.allergies ?? null,
      currentMedication: values.currentMedication ?? null,
      familyMedicalHistory: values.familyMedicalHistory ?? null,
      pastMedicalHistory: values.pastMedicalHistory ?? null,
      identificationType: values.identificationType ?? null,
      identificationNumber: values.identificationNumber ?? null,
      identificationDocument: fileData,
      treatmentConsent: values.treatmentConsent,
      disclosureConsent: values.disclosureConsent,
      privacyConsent: values.privacyConsent,
    };

    try {
      const newPatient = await registerPatient(payload);
      if (newPatient) router.push(`/patients/${userId}/new-appointment`);
    } catch (error) {
      console.error("Registration error:", error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Let us know more about yourself.
          </p>
        </section>

        {/* ✅ PERSONAL DETAILS */}
        <section className="space-y-6">
          <h2 className="sub-header">Personal Information</h2>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            placeholder="John Doe"
          />

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email address"
              placeholder="you@example.com"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="+91 9876543210"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Date of birth"
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex gap-6"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="address" />
            <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="occupation" />
          </div>
        </section>

        {/* ✅ MEDICAL DETAILS */}
        <section className="space-y-6">
          <h2 className="sub-header">Medical Information</h2>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="insuranceProvider" />
            <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="insurancePolicyNumber" />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="allergies" />
            <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="currentMedication" />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="familyMedicalHistory" />
            <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="pastMedicalHistory" />
          </div>
        </section>

        {/* ✅ IDENTIFICATION */}
        <section className="space-y-6">
          <h2 className="sub-header">Identification & Verification</h2>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="identificationNumber"
            label="ID Number"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Upload ID Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

        {/* ✅ CONSENTS */}
        <section className="space-y-6">
          <h2 className="sub-header">Consent & Privacy</h2>

          <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX} name="treatmentConsent" />
          <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX} name="disclosureConsent" />
          <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX} name="privacyConsent" />
        </section>

        <SubmitButton isLoading={isLoading}>Submit & Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
