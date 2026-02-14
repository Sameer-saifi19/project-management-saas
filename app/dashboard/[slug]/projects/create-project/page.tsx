import { CreateProjectForm } from "@/components/forms/create-project";

export default function Page() {
  return (
    <>
      <div className="h-screen flex items-center justify-center">
            <div className="max-w-lg w-full">
                <CreateProjectForm/>
            </div>
      </div>
    </>
  )
}