export interface RegisterUserParams {
  userId: string;

  name: string;
  email: string;
  phone: string;

  birthDate: string; //  ISO string, not Date
  gender: "male" | "female" | "other";
  address: string;
  occupation: string;

  emergencyContactName: string;
  emergencyContactNumber: string;

  insuranceProvider: string;
  insurancePolicyNumber: string;

  allergies?: string | null;
  currentMedication?: string | null;
  familyMedicalHistory?: string | null;
  pastMedicalHistory?: string | null;

  identificationType?: string | null;
  identificationNumber?: string | null;
  identificationDocument?: FormData | null;

  treatmentConsent: boolean;
  disclosureConsent: boolean;
  privacyConsent: boolean;
}
