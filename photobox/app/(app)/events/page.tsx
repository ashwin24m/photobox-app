"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";

export default function EventsPage() {

  const supabase = getSupabase();

  const [events, setEvents] = useState<any[]>([]);
  const [usage, setUsage] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {

    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    setEvents(eventsData || []);

    // Load storage usage for each event

    const usageMap: any = {};

    for (const event of eventsData || []) {

      const { data: media } = await supabase
        .from("media")
        .select("file_size")
        .eq("event_id", event.id);

      const totalBytes =
        (media || []).reduce(
          (sum, m) => sum + Number(m.file_size || 0),
          0
        );

      usageMap[event.id] = totalBytes;

    }

    setUsage(usageMap);

    setLoading(false);

  }

  function copy(text: string) {

    navigator.clipboard.writeText(text);
    alert("Copied");

  }

  function daysLeft(expiry: string) {

    return Math.max(
      0,
      Math.ceil(
        (new Date(expiry).getTime() - Date.now())
        /
        (1000 * 60 * 60 * 24)
      )
    );

  }

  function formatGB(bytes: number) {

    return (bytes / 1024 / 1024 / 1024).toFixed(2);

  }

  return (

    <main className="min-h-screen bg-gray-50">

      <div className="max-w-md mx-auto px-4 py-6">

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-xl font-semibold">
            Your Events
          </h1>

          <Link
            href="/events/new"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            New
          </Link>

        </div>

        {loading && (
          <p className="text-sm text-gray-500">
            Loading...
          </p>
        )}

        <div className="space-y-4">

          {events.map((event) => {

            const usedBytes = usage[event.id] || 0;

            const limitBytes =
              event.storage_limit_gb * 1024 * 1024 * 1024;

            const percent =
              Math.min(
                100,
                (usedBytes / limitBytes) * 100
              );

            const uploadLink =
              `${window.location.origin}/e/${event.event_code}`;

            const galleryLink =
              `${window.location.origin}/g/${event.event_code}`;

            return (

              <div
                key={event.id}
                className="bg-white rounded-xl p-4 shadow-sm border"
              >

                {/* Title */}

                <h2 className="font-semibold mb-1">
                  {event.name}
                </h2>

                {/* Expiry */}

                <p className="text-xs text-gray-500 mb-3">

                  Expires in {daysLeft(event.expiry_date)} days

                </p>

                {/* Storage Bar */}

                <div className="mb-2">

                  <div className="w-full bg-gray-200 h-2 rounded">

                    <div
                      className="bg-black h-2 rounded"
                      style={{ width: `${percent}%` }}
                    />

                  </div>

                  <p className="text-xs text-gray-500 mt-1">

                    {formatGB(usedBytes)} GB / {event.storage_limit_gb} GB

                  </p>

                </div>

                {/* Copy buttons */}

                <div className="flex gap-2 mb-3">

                  <button
                    onClick={() => copy(uploadLink)}
                    className="flex-1 border rounded-lg py-2 text-sm"
                  >
                    Copy Upload
                  </button>

                  <button
                    onClick={() => copy(galleryLink)}
                    className="flex-1 border rounded-lg py-2 text-sm"
                  >
                    Copy Gallery
                  </button>

                </div>

                {/* Open */}

                <Link
                  href={`/events/${event.id}`}
                  className="block text-center bg-black text-white py-2 rounded-lg text-sm"
                >
                  Manage Event
                </Link>

              </div>

            );

          })}

        </div>

      </div>

    </main>

  );

}
