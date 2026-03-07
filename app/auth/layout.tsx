<<<<<<< HEAD
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  
  return (
    <main className="flex items-center justify-center h-screen">
      {children}
    </main>
  );
};

export default layout;
=======
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main suppressHydrationWarning className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-sm">
                    {children}
                </div>
            </main>
        </>
    )
}
>>>>>>> prod
