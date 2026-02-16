import MemberTable from "@/components/global/member-table";
import AddNewMember from "@/components/modals/add-member";
import { listMembers } from "@/server/member";

export default async function MembersPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const data = await listMembers(slug);

  const flattenData =
    data.data?.members.map((m) => ({
      id: m.id,
      image: m.user.image || "https://",
      name: m.user.name,
      email: m.user.email,
      role: m.role as "admin" | "owner" | "member",
    })) ?? [];

  return (
    <>
      <div className="flex flex-col gap-12 w-full justify-between">
        <div className="flex items-center justify-between">
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                    Collaborators
                  </h1>
                  <AddNewMember/>
                </div>
        <div className="flex">
          <div className="w-3/4">
            <MemberTable members={flattenData} />
          </div>
          <div className="w-1/4 bg-accent">
            <h1>Tabs Area</h1>
          </div>
        </div>
      </div>
    </>
  );
}
