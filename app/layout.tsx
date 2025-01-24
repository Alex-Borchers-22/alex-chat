import { Metadata } from "next";
import { LayoutContent } from "./layout-content";

export const metadata: Metadata = {
  title: "Chat with Alex",
  description: "Have a conversation with Alex about his life and work experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutContent>{children}</LayoutContent>;
}
