"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { SelectWorkspaceType } from "@/db/schema/schema";
import { getAllWorkspaces } from "@/action";
import { useEffect, useState } from "react";

const OrgSwitcher = () => {
  const [organizations, setOrganizations] = useState<SelectWorkspaceType[]>([]);
  const router = useRouter();
  const { data: org } = authClient.useListOrganizations();
  const slug = org ? org[0]?.slug : "default-organization";
  const orgName = org ? org[0]?.name : "Default Organization";
  console.log("org-slug:: \n", slug);
  useEffect(() => {
    const fetchOrganizations = async () => {
      // const org await
      const orgs = await getAllWorkspaces();
      // const { data } = await authClient.organization.getFullOrganization();
      setOrganizations(orgs || []);
    };
    fetchOrganizations();
  }, []);

  const handleChangeOrganization = async (organizationSlug: string) => {
    const { error } = await authClient.organization.setActive({
      organizationSlug,
    });

    if (error) throw new Error(error.statusText + error.status);

    router.push(`/workspace/${organizationSlug}/`);
  };
  return (
    <Select onValueChange={handleChangeOrganization} defaultValue={slug}>
      <SelectTrigger className="w-50 dark:text-white bg-white/75">
        <SelectValue>{orgName}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {organizations.map((org) => (
            <SelectItem
              className="dark:text-white/75"
              value={org.slug}
              key={org.id}
              onClick={() => router.push(`/workspace${org.slug}`)}
            >
              {org.name}
            </SelectItem>
          ))}
          <SelectSeparator />
          <SelectItem
            className="dark:text-white/75"
            value="create-new-organization"
            onClick={() => router.push("/workspace/new")}
          >
            Create New Organization
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default OrgSwitcher;
