import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0A0A0B] text-white">


      {/* Velvet Lighting */}


      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-[#C6A15B] opacity-[0.07] blur-[180px]" />

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#6A5ACD] opacity-[0.07] blur-[180px]" />




      {/* Navbar */}



      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">


          <div className="flex items-center gap-4">


            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E7D3A3] to-[#C6A15B] flex items-center justify-center font-bold text-black text-lg">

              P

            </div>


            <span className="text-2xl font-[var(--font-playfair)]">

              PhotoBox

            </span>


          </div>



          <Link
            href="/events"
            className="px-6 py-3 rounded-lg border border-[#C6A15B]/40 text-[#E7D3A3] hover:bg-[#C6A15B]/10 transition"
          >

            Dashboard

          </Link>


        </div>


      </header>





      {/* HERO SECTION */}



      <section className="max-w-7xl mx-auto px-8 py-32 grid md:grid-cols-2 gap-20 items-center">



        {/* LEFT */}



        <div>


          <div className="text-[#C6A15B] tracking-[0.4em] text-xs mb-8">

            PRIVATE EVENT GALLERY

          </div>



          <h1 className="text-7xl leading-[1.05] font-[var(--font-playfair)]">

            Preserve Every

            <span className="block text-[#C6A15B]">

              Precious Moment

            </span>

          </h1>



          <p className="mt-8 text-white/60 text-lg max-w-xl leading-relaxed">

            Invite guests. Collect original-quality photos and videos.

            Curate and present them in a private gallery designed to last.

          </p>



          <div className="mt-14 flex gap-6">


            <Link
              href="/events/new"
              className="px-10 py-5 rounded-xl bg-gradient-to-b from-[#E7D3A3] to-[#C6A15B] text-black font-semibold text-lg hover:scale-[1.03] transition"
            >

              Create Event

            </Link>



            <Link
              href="/events"
              className="px-10 py-5 rounded-xl border border-white/20 hover:border-white/40 transition"
            >

              View Dashboard

            </Link>


          </div>


        </div>





        {/* RIGHT ILLUSTRATION */}



        <div className="relative">


          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl blur-2xl"></div>



          <div className="relative border border-white/10 rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.9)]">


            <Image
              src="/hero-photobox.jpg"
              alt="PhotoBox preview"
              width={900}
              height={700}
              priority
              className="object-cover w-full h-full"
            />


          </div>


        </div>


      </section>





      {/* PRICING SECTION */}



      <section className="max-w-7xl mx-auto px-8 pb-32">


        <h2 className="text-4xl font-[var(--font-playfair)] text-center mb-20">

          Choose Your Plan

        </h2>



        <div className="grid md:grid-cols-3 gap-10">



          <Plan

            name="Starter"

            price="₹499"

            storage="5GB Storage"

            duration="7 Days Access"

          />



          <Plan

            name="Classic"

            price="₹999"

            storage="15GB Storage"

            duration="30 Days Access"

            featured

          />



          <Plan

            name="Luxury"

            price="₹1999"

            storage="50GB Storage"

            duration="90 Days Access"

          />



        </div>


      </section>





      {/* SIGNATURE */}



      <section className="text-center pb-24">


        <div className="text-[#C6A15B] font-[var(--font-playfair)] text-3xl">

          Where Memories Find Their Home

        </div>


      </section>





      {/* FOOTER */}



      <footer className="border-t border-white/10">


        <div className="max-w-7xl mx-auto px-8 py-8 flex justify-between text-white/30">


          <span>

            © PhotoBox

          </span>


          <span>

            Private Event Gallery Platform

          </span>


        </div>


      </footer>



    </main>

  );
}






function Plan({

  name,

  price,

  storage,

  duration,

  featured,

}: any) {


  return (


    <div

      className={`rounded-2xl p-10 border backdrop-blur-xl transition hover:scale-[1.02]

      ${

        featured

          ? "border-[#C6A15B] bg-white/5"

          : "border-white/10"

      }`}

    >



      <div className="text-xl mb-4 font-semibold">

        {name}

      </div>



      <div className="text-4xl text-[#C6A15B] mb-6 font-[var(--font-playfair)]">

        {price}

      </div>



      <div className="text-white/60 mb-2">

        {storage}

      </div>



      <div className="text-white/60 mb-8">

        {duration}

      </div>



      <Link

        href="/events/new"

        className="block text-center bg-gradient-to-b from-[#E7D3A3] to-[#C6A15B] text-black py-3 rounded-lg font-semibold"

      >

        Select Plan

      </Link>



    </div>


  );

}
