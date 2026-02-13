import CreateOrgForm from "@/components/forms/create-organization";

export default function Page() {
  return (
    <>
      <div className="flex items-center flex-col justify-center gap-4 h-screen">
        <h1 className="text-4xl">Create organization</h1>
        <CreateOrgForm/>
      </div>
    </>
  )
}