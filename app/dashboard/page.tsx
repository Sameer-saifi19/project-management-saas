import { SignOutButton } from "../auth/_components/signout-btn";

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-center gap-4 h-screen">
        <h1 className="text-4xl">Dashboard</h1>
        <SignOutButton />
      </div>
    </>
  );
}
