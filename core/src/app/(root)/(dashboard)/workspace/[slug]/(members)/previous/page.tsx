import { CallList} from "@/components/workspace/calls";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Previous Calls",
  description: "",
  icons: {
    icon: "/icons/Previous.svg",
  },
};

const PreviousPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  
  return (
    <>
      <CallList type="ended" workspaceSlug={slug} />
    </>
  );
};

export default PreviousPage;
