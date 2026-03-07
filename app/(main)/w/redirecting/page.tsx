import { redirectAfterDelete } from "@/server/workspace";
import { redirect } from "next/navigation";

export default async function Page() {
  const redirection = await redirectAfterDelete();
  if(!redirection.data){
    return null
  }
  if (redirection.data.length > 0) {
    redirect(`/w/${redirection.data[0]}/projects`);
  } else {
    redirect("/create-workspace");
  }
}
