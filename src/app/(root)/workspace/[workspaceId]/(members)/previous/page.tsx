import CallList from "@/components/CallList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Previous Calls | DevnTalk",
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
