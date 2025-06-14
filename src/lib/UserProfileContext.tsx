import React, { createContext, useContext, useState, type ReactNode } from "react";

// Define the profile shape used for health & allergy safety
export interface UserProfile {
  allergies: string[];
  avoidIngredients: string[];
  preferredIngredients: string[];
  [key: string]: any; // Expand this as needed
}

interface UserProfileContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  resetProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const resetProfile = () => setProfile(null);

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, resetProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within a UserProfileProvider");
  return ctx;
}
