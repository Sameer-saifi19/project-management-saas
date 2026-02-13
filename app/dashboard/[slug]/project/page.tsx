import { CreateProjectForm } from "@/components/forms/create-project";

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-sm w-full">
          <CreateProjectForm />
        </div>
      </div>
    </>
  );
}
