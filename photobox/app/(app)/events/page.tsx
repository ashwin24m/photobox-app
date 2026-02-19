"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

type Event = {

  id: string;

  name: string;

  host_name: string;

  event_date: string;

  guest_limit: number;

  storage_limit_gb: number;

  validity_days: number;

  event_code: string;

  payment_status: string;

  created_at: string;

};

export default function EventsPage() {

  const supabase = getSupabase();

  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    loadEvents();

  }, []);




  async function loadEvents() {

    const { data, error } = await supabase

      .from("events")

      .select("*")

      .order("created_at", { ascending: false });



    if (error) {

      console.error(error);

    } else {

      setEvents(data || []);

    }


    setLoading(false);

  }




  return (

    <main className="min-h-screen bg-[#0A0A0B] text-white">


      <div className="max-w-6xl mx-auto px-8 py-16">


        {/* Header */}


        <div className="flex justify-between items-center mb-12">


          <div>


            <h1 className="text-5xl font-[var(--font-playfair)]">

              Your Events

            </h1>


            <p className="text-white/60 mt-2">

              Manage and access your galleries

            </p>


          </div>



          <Link
            href="/events/new"
            className="px-6 py-3 rounded-lg bg-gradient-to-b from-[#E7D3A3] to-[#C6A15B] text-black font-semibold"
          >

            Create Event

          </Link>


        </div>




        {/* Content */}



        {loading && (

          <div className="text-white/40">

            Loading events...

          </div>

        )}



        {!loading && events.length === 0 && (

          <div className="text-white/40">

            No events created yet

          </div>

        )}



        <div className="grid gap-6">


          {events.map((event) => (

            <EventCard key={event.id} event={event} />

          ))}


        </div>


      </div>


    </main>

  );

}






function EventCard({ event }: { event: Event }) {


  const eventDate = new Date(event.event_date).toLocaleDateString();


  return (

    <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">


      <div className="flex justify-between items-start">


        {/* Left */}


        <div>


          <div className="text-2xl font-semibold mb-1">

            {event.name}

          </div>


          <div className="text-white/60 text-sm">

            Host: {event.host_name}

          </div>


          <div className="text-white/60 text-sm">

            Event Date: {eventDate}

          </div>


          <div className="text-white/60 text-sm">

            Guests: Up to {event.guest_limit}

          </div>


          <div className="text-white/60 text-sm">

            Storage: {event.storage_limit_gb} GB

          </div>



          <div className="mt-2">


            {event.payment_status === "pending" && (

              <span className="text-yellow-400 text-sm">

                Payment Pending

              </span>

            )}


            {event.payment_status === "paid" && (

              <span className="text-green-400 text-sm">

                Active

              </span>

            )}


          </div>


        </div>




        {/* Right */}



        <div className="flex flex-col gap-3">


          <Link
            href={`/events/${event.id}`}
            className="px-4 py-2 border border-white/20 rounded-lg text-sm text-center hover:bg-white/10"
          >

            Manage

          </Link>



          <Link
            href={`/e/${event.event_code}`}
            className="px-4 py-2 border border-white/20 rounded-lg text-sm text-center hover:bg-white/10"
          >

            Upload Link

          </Link>



          <Link
            href={`/g/${event.event_code}`}
            className="px-4 py-2 border border-white/20 rounded-lg text-sm text-center hover:bg-white/10"
          >

            Gallery

          </Link>


        </div>


      </div>


    </div>

  );

}
