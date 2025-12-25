"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSession as useBetterAuthSession } from "@/lib/auth-client";
import type { PrivateUserDTO } from "@/lib/dto";

interface AuthContextType {
  user: PrivateUserDTO | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoaded: false,
  isSignedIn: false,
  refreshUser: async () => {},
});

export function useUser() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending, refetch } = useBetterAuthSession();

  const user: PrivateUserDTO | null = data?.user
    ? {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        userName: data.user.userName,
        createdAt: data.user.createdAt,
      }
    : null;

  const refreshUser = async () => {
    await refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded: !isPending,
        isSignedIn: !!data?.user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
