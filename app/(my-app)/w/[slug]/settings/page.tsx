import { getFullOrganization } from "@/server/organization";
import { WorkspaceSettingsForm } from "./client";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const defaultData = await getFullOrganization(slug);
  return (
    <div className="flex flex-col gap-6 p-2 max-w-7xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Workspace Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace settings, members, and preferences.
        </p>
      </div>

      {/* Settings Form */}
      <WorkspaceSettingsForm
        orgId={defaultData.data?.id as string}
        name={defaultData.data?.name as string}
        description={defaultData.data?.description as string}
        slug={defaultData.data?.slug as string}
      />
    </div>
  );
}
