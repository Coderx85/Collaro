"use client";

import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IWorkspaceDTO } from "@/modules/workspace";
import { getAllWorkspaces } from "@/action";
import { useEffect, useState } from "react";
import { useWorkspaceStore } from "@/store/workspace";

const OrgSwitcher = () => {
  const [organizations, setOrganizations] = useState<IWorkspaceDTO[]>([]);
  const router = useRouter();
  const { data: org } = authClient.useListOrganizations();

  // Use workspace store
  const { workspaceSlug, setWorkspace } = useWorkspaceStore();

  // Get current org from Better Auth or fallback to store
  const currentSlug = org?.[0]?.slug || workspaceSlug || "default-organization";
  const currentName = org?.[0]?.name || "Default Organization";

  useEffect(() => {
    const fetchOrganizations = async () => {
      const response = await getAllWorkspaces();
      if (response.success && response.data) {
        setOrganizations(response.data);
      } else {
        setOrganizations([]);
      }

      // Sync workspace store with Better Auth active org
      if (org?.[0]) {
        setWorkspace(org[0].id, org[0].name, org[0].slug);
      }
    };
    fetchOrganizations();
  }, [org, setWorkspace]);

  const handleChangeOrganization = async (organizationSlug: string) => {
    const { error } = await authClient.organization.setActive({
      organizationSlug,
    });

    if (error) throw new Error(error.statusText + error.status);

    // Find the selected organization to update store
    const selectedOrg = organizations.find((o) => o.slug === organizationSlug);
    if (selectedOrg) {
      setWorkspace(selectedOrg.id as unknown as string, selectedOrg.name, selectedOrg.slug);
    }

    router.push(`/workspace/${organizationSlug}/`);
  };

  return (
    <Select onValueChange={handleChangeOrganization} value={currentSlug}>
      <SelectTrigger className="w-50 dark:text-white bg-white/75">
        <SelectValue>{currentName}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {organizations.map((org) => (
            <SelectItem
              className="dark:text-white/75"
              value={org.slug}
              key={org.id as unknown as string}
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
