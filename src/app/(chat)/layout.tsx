"use client";

import Bar from "@/components/bar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative w-full flex items-center justify-center">
        <Bar />
      </div>
      {children}
    </div>
  );
}
