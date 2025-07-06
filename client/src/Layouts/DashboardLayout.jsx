import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      <aside className="w-64 bg-zinc-800 p-4">Sidebar</aside>
      <main className="flex-1 flex flex-col">
        <header className="bg-zinc-700 p-4">Topbar</header>
        <section className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
