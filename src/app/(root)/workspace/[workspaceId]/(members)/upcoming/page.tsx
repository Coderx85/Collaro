import CallList from "@/components/CallList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Calls | DevnTalk",
  description: "",
  icons: {
    icon: "/icons/upcoming.svg",
  },
};

const UpcomingPage = () => {
  return (
    <>
      <CallList type="upcoming" />
    </>
  );
};

export default UpcomingPage;
