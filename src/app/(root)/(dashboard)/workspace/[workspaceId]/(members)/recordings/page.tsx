import CallList from "@/components/CallList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recordings",
  description: "",
  icons: {
    icon: "/icons/Recordings.svg",
  },
};

const PreviousPage = () => {
  return (
    <>
      <CallList type="recordings" />
    </>
  );
};

export default PreviousPage;
