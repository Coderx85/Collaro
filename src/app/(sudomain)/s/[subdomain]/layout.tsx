import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist } from "next/font/google";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "@/app/globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { dark } from "@clerk/themes";

/**
 * Props type for the SubdomainLayout component
 */
type Props = {
  children: ReactNode; // React children that will be rendered within this layout
};

const geist = Geist({ subsets: ["latin"] });

const SubdomainLayout = ({ children }: Props) => {
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
      {/* HTML structure for subdomain pages */}
      <html lang="en">
        <body className={`${geist.className}`}>
          {/* Theme provider for dark/light mode support */}
          <ThemeProvider
            attribute="class" // Use class-based theme switching
            defaultTheme="dark" // Default to dark theme for subdomain workspaces
            enableSystem // Allow system theme preference detection
            disableTransitionOnChange // Disable transitions when theme changes for better performance
          >
            {/* Toast notification container */}
            <Toaster />

            {/* Render the page content */}
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default SubdomainLayout;
