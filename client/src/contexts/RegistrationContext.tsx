import { createContext, useContext, useState, ReactNode } from "react";

interface RegistrationData {
  step1: {
    fullName: string;
    gender: string;
    guardianName: string;
    guardianOccupation: string;
    dateOfBirth: { day: string; month: string; year: string };
  };
  step2: {
    collegeName: string;
    course: string;
    startYear: string;
    endYear: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  step3: {
    studentContact: string;
    whatsappNumber: string;
    guardianContact: string;
    email: string;
    familyIncome: string;
  };
  step4: {
    aadhaar: string;
    isPWD: string;
    isGovtEmployee: string;
    selfie: File | null;
  };
}

interface RegistrationContextType {
  registrationData: RegistrationData;
  updateStep1: (data: RegistrationData["step1"]) => void;
  updateStep2: (data: RegistrationData["step2"]) => void;
  updateStep3: (data: RegistrationData["step3"]) => void;
  updateStep4: (data: RegistrationData["step4"]) => void;
  resetRegistration: () => void;
}

const initialRegistrationData: RegistrationData = {
  step1: {
    fullName: "",
    gender: "",
    guardianName: "",
    guardianOccupation: "",
    dateOfBirth: { day: "", month: "", year: "" },
  },
  step2: {
    collegeName: "",
    course: "",
    startYear: "",
    endYear: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  },
  step3: {
    studentContact: "",
    whatsappNumber: "",
    guardianContact: "",
    email: "",
    familyIncome: "",
  },
  step4: {
    aadhaar: "",
    isPWD: "",
    isGovtEmployee: "",
    selfie: null,
  },
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [registrationData, setRegistrationData] = useState<RegistrationData>(
    initialRegistrationData
  );

  const updateStep1 = (data: RegistrationData["step1"]) => {
    setRegistrationData((prev) => ({ ...prev, step1: data }));
  };

  const updateStep2 = (data: RegistrationData["step2"]) => {
    setRegistrationData((prev) => ({ ...prev, step2: data }));
  };

  const updateStep3 = (data: RegistrationData["step3"]) => {
    setRegistrationData((prev) => ({ ...prev, step3: data }));
  };

  const updateStep4 = (data: RegistrationData["step4"]) => {
    setRegistrationData((prev) => ({ ...prev, step4: data }));
  };

  const resetRegistration = () => {
    setRegistrationData(initialRegistrationData);
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        updateStep1,
        updateStep2,
        updateStep3,
        updateStep4,
        resetRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error("useRegistration must be used within a RegistrationProvider");
  }
  return context;
}
