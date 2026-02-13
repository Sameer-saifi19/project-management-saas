import { redirect } from "next/navigation";
import { onUserAuthenticate } from "@/server/user";

export default async function PostAuthPage() {

  const orgCount = await onUserAuthenticate();
  
  if (orgCount === 0) {
    redirect("/onboarding");
  }

  redirect("/dashboard");
}
