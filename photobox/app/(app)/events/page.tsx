"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function EventsPage() {

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  async function loadEvents() {

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setEvents(data || []);
    }

    setLoading(false);
  }


  useEffect(() => {
    loadEvents();
  }, []);


  return (

    <main className="min-h-screen bg-white">

      <div className="max-w-md mx-auto px-4 py-6">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-xl font-semibold text-gray-800">
            Your Events
          </h1>

          <Link
            href="/events/new"
            className="text-sm text-blue-600"
          >
            New
          </Link>

        </div>


        {loading && (
          <p className="text-sm text-gray-500">
            Loading...
          </p>
        )}


        {!loading && events.length === 0 && (

          <p className="text-sm text-gray-500">
            No events yet
          </p>

        )}


        <div className="space-y-3">

          {events.map((event) => (

            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block border rounded-lg p-4"
            >

              <h2 className="font-medium text-gray-800">
                {event.name}
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Code: {event.event_code}
              </p>

            </Link>

          ))}

        </div>


      </div>

    </main>

  );

}
