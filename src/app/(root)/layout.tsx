import { ReactNode } from "react";
import { Geist } from "next/font/google";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Metadata } from "next/types";
import { ThemeProvider } from "@/components/providers/theme";

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
    <html lang="en">
      <body className={`${geist.className}`} suppressHydrationWarning>
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
  );
}
