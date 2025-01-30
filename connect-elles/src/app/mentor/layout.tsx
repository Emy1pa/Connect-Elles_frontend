import MentorSideBar from "./sidebar/page";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <MentorSideBar />
      <main className="p-4 flex-1">{children}</main>
    </div>
  );
}
