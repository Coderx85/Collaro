import CallList from "@/components/CallList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Calls | Collaro",
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
