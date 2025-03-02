"use client";

import Bar from "@/components/bar";

interface RootLayoutProps {
  children: React.ReactNode;
}
export default async function RootLayout({ children }: RootLayoutProps) {
  return <div className="">{children}</div>;
}
