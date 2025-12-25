import StreamVideoProvider from "@/providers/StreamClientProvider";
import type React from "react";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = (props: Props) => {
  return <StreamVideoProvider>{props.children}</StreamVideoProvider>;
};

export default DashboardLayout;
