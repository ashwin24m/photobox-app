import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <main className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">


      {/* Velvet lighting */}

      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#C6A15B] opacity-[0.06] blur-[180px]" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#6A5ACD] opacity-[0.06] blur-[180px]" />



      {/* Navbar */}

      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl">

        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">


          <Link href="/" className="flex items-center gap-3">


            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E7D3A3] to-[#C6A15B] flex items-center justify-center font-bold text-black">

              P

            </div>


            <span className="text-xl font-[var(--font-playfair)]">

              PhotoBox

            </span>


          </Link>



          <Link

            href="/events"

            className="px-4 py-2 border border-[#C6A15B]/40 text-[#E7D3A3] rounded-lg text-sm"

          >

            Dashboard

          </Link>


        </div>


      </header>



      {/* Page Content */}

      <div className="relative z-10">

        {children}

      </div>



    </main>

  );
}
