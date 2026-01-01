"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ErrorPage = ({
  errorType,
}: {
  errorType: "unauthorized" | "not_found";
}) => {
  const router = useRouter();

  const errorMessages = {
    unauthorized: {
      title: "Access Denied",
      description: "You do not have permission to view this workspace.",
    },
    not_found: {
      title: "Workspace Not Found",
      description: "The workspace you're looking for does not exist.",
    },
  };

  const { title, description } = errorMessages[errorType];

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-lg text-gray-300">{description}</p>

        <Button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-linear-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-white rounded-lg"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
