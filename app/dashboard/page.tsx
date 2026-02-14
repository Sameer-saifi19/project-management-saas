'use client'

import { SignOutButton } from "../auth/_components/signout-btn";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-10 h-screen">
        <h1 className="text-4xl">Dashboard</h1>
        <SignOutButton />
      </div>
    </>
  );
}
