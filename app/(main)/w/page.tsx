import Loader from "@/components/global/loader";
import { findOrgSlugById } from "@/server/user";
import { redirect } from "next/navigation";

export default async function Page() {
  const auth = await findOrgSlugById();

  if (auth.success) {
    redirect(`/w/${auth.data?.slug}/projects`);
  }

  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <h1>
          <Loader /> Setting up your workspace
        </h1>
      </div>
    </>
  );
}
