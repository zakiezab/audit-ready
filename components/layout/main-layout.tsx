import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <div className="ml-[240px] flex-1 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
