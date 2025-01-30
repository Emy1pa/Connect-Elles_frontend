import Sidebar from "./sidebar/page";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="p-4 flex-1">{children}</main>
    </div>
  );
}
