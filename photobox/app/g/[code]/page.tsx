"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

const supabase = getSupabase();

export default function PublicGalleryPage() {

  const params = useParams();
  const eventCode = params.code as string;

  const [event, setEvent] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {

    loadGallery();

  }, []);

  async function loadGallery() {

    setLoading(true);

    const { data: eventData } =
      await supabase
        .from("events")
        .select("*")
        .eq("event_code", eventCode)
        .single();

    if (!eventData) {

      setLoading(false);
      return;

    }

    if (!eventData.is_published) {

      setLoading(false);
      return;

    }

    if (
      eventData.expiry_date &&
      new Date(eventData.expiry_date) < new Date()
    ) {

      setExpired(true);
      setLoading(false);
      return;

    }

    setEvent(eventData);

   const { data: mediaData } =
  await supabase
    .from("media")
    .select("*")
    .eq("event_code", eventCode)
    .eq("status", "approved")
    .order("created_at", { ascending: false });


    console.log("MEDIA FOUND:", mediaData);

    setMedia(mediaData || []);

    setLoading(false);

  }

  function daysLeft() {

    if (!event?.expiry_date) return 0;

    return Math.max(
      0,
      Math.ceil(
        (new Date(event.expiry_date).getTime() - Date.now())
        / 86400000
      )
    );

  }

  function next() {

    if (activeIndex === null) return;

    setActiveIndex(
      (activeIndex + 1) % media.length
    );

  }

  function prev() {

    if (activeIndex === null) return;

    setActiveIndex(
      (activeIndex - 1 + media.length) % media.length
    );

  }

  if (loading)
    return <CenterText text="Loading gallery..." />;

  if (expired)
    return <CenterText text="Gallery expired" />;

  if (!event)
    return <CenterText text="Gallery not available" />;

  return (

    <main className="min-h-screen bg-white">

      {/* HEADER */}

      <div className="sticky top-0 bg-white border-b">

        <div className="max-w-md mx-auto px-4 py-4">

          <div className="text-lg font-semibold">
            {event.name}
          </div>

          <div className="text-xs text-gray-500">
            {media.length} items • {daysLeft()} days left
          </div>

        </div>

      </div>

      {/* GRID */}

      <div className="max-w-md mx-auto px-4 py-4">

        {media.length === 0 &&
          <p>No photos yet</p>
        }

        <div className="grid grid-cols-2 gap-3">

          {media.map((item, index) => {

            const isVideo =
              item.file_url.includes("/video/");

            return (

              <div
                key={item.id}
                onClick={() => setActiveIndex(index)}
              >

                {isVideo ?

                  <video
                    src={item.file_url}
                    className="rounded-xl"
                  />

                  :

                  <img
                    src={item.file_url}
                    className="rounded-xl"
                  />

                }

              </div>

            );

          })}

        </div>

      </div>

      {/* VIEWER */}

      {activeIndex !== null && (

        <div className="fixed inset-0 bg-black flex items-center justify-center">

          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-6 right-6 text-white text-2xl"
          >
            ✕
          </button>

          {media[activeIndex].file_url.includes("/video/") ?

            <video
              src={media[activeIndex].file_url}
              controls
              autoPlay
            />

            :

            <img
              src={media[activeIndex].file_url}
            />

          }

          {event.downloads_enabled && (

            <a
              href={media[activeIndex].file_url}
              download
              className="absolute bottom-8 bg-white px-6 py-3 rounded-xl"
            >
              Download
            </a>

          )}

        </div>

      )}

    </main>

  );

}

function CenterText({ text }: any) {

  return (

    <main className="min-h-screen flex items-center justify-center">

      {text}

    </main>

  );

}
