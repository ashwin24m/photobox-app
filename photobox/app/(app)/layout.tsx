export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-semibold">PhotoBox</h1>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>

    </div>
  );
}
