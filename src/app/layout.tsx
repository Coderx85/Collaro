import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import { Toaster } from "sonner";
import { Metadata } from "next/types";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevTalk",
  description: "Video calling App",
  icons: {
    icon: "/icons/logo.svg",
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
          logoImageUrl: "/icons/logo.svg",
        },
      }}
    >
      <html lang='en'>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
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
