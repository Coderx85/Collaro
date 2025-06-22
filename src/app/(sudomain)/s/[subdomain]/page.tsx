import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

type Subdomain = {
  params: Promise<{
    subdomain: string;
  }>;
};

/**
 * Subdomain Page Component
 *
 * This page is rendered when a user visits a subdomain (e.g., tenant.example.com)
 * The middleware rewrites subdomain requests to /s/[subdomain], which renders this component
 *
 * @param params - Contains the subdomain parameter from the dynamic route
 */
const SubdomainPage = async ({ params }: Subdomain) => {
  // Await the params Promise to get the actual subdomain value
  const { subdomain } = await params;
  console.log(subdomain); // Debug: Log the subdomain for development

  // Get Clerk client instance for organization management
  const clerk = await clerkClient();

  // Redirect to sign-in if Clerk client is not available
  if (!clerk) redirect("/sign-in");

  // Fetch organization data from Clerk using the subdomain as the organization slug
  const org = await clerk.organizations.getOrganization({ slug: subdomain });

  // Extract organization ID for potential future use
  const orgId = org.id;

  return (
    <div>
      {/* Display basic subdomain and organization information */}
      <p>
        This is a {subdomain} Page and ID: {orgId}
      </p>
      Organisation List:
      {/* Organization information card */}
      <Card className="w-full max-w-2xl p-6 mx-auto mt-4 bg-amber-900">
        <CardTitle className="text-3xl font-bold mb-4">{org.name}</CardTitle>
        <CardContent className="text-black/95">
          Created at: {new Date(org.createdAt).toLocaleDateString()}
          <br />
          Updated at: {new Date(org.updatedAt).toLocaleDateString()}
          <br />
          Created By: {org.createdBy}
          <br />
          <Image
            src={org.imageUrl}
            alt="Organization Logo"
            width={100}
            height={100}
            className=" mt-4"
          />
          <br />
        </CardContent>
      </Card>
    </div>
  );
};

export default SubdomainPage;
