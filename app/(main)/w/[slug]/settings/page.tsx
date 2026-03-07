import { getFullWorkspace } from "@/server/workspace";
import SettingsClient from "./client";

export default async function Page() {
  const { data } = await getFullWorkspace();

  return (
    <>
      <main className="flex flex-col gap-6 p-4 w-full max-7-wxl">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Workspace Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your workpsace and more
          </p>
        </div>
        <SettingsClient
          imageUrl={data?.logo as string}
          slug={data?.slug as string}
          workspaceId={data?.id as string}
          workspaceName={data?.name as string}
        />
      </main>
    </>
  );
}
