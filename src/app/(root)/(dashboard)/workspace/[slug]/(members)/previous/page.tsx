import CallList from "@/components/CallList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Previous Calls",
  description: "",
  icons: {
    icon: "/icons/Previous.svg",
  },
};

const PreviousPage = () => {
  return (
    <>
      <CallList type="ended" />
    </>
  );
};

export default PreviousPage;
