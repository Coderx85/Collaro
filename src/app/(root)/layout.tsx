import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist } from "next/font/google";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Metadata } from "next/types";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { dark } from "@clerk/themes";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collaro",
  description:
    "A modern developer collaboration platform built for remote teams. Collaro seamlessly integrates real-time communication, live streaming, and structured meetings to enhance team productivity.",
  icons: {
    icon: "/icons/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        layout: {
          animations: true,
          logoPlacement: "inside",
          socialButtonsVariant: "iconButton",
          logoImageUrl: "/icons/logo.png",
        },
      }}
      signInFallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGNIN_REDIRECT_URL}
    >
      <html lang="en">
        <body className={`${geist.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
