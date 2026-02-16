import MemberTable from "@/components/global/member-table";
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
      <div className="flex w-full justify-between">
        <div className="w-3/4">
          <MemberTable members={flattenData} />
        </div>
        <div className="w-1/4 bg-accent">
            <h1>Tabs Area</h1>
        </div>
      </div>
    </>
  );
}
