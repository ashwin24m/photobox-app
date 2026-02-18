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

  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  const [expired, setExpired] = useState(false);


  useEffect(() => {

    loadGallery();

  }, []);


  async function loadGallery() {

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
      new Date(eventData.expiry_date).getTime()
      <
      Date.now()
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
        .eq("event_id", eventData.id)
        .eq("approved", true)
        .order("created_at", {
          ascending: false
        });


    setMedia(mediaData || []);
    setLoading(false);

  }


  function daysLeft() {

    if (!event?.expiry_date) return 0;

    return Math.max(

      0,

      Math.ceil(

        (
          new Date(event.expiry_date).getTime()
          -
          Date.now()
        )

        /

        (1000 * 60 * 60 * 24)

      )

    );

  }


  if (loading) {

    return (

      <main className="min-h-screen bg-white flex items-center justify-center">

        <p className="text-gray-500">
          Loading gallery...
        </p>

      </main>

    );

  }


  if (expired) {

    return (

      <main className="min-h-screen bg-white flex items-center justify-center">

        <p className="text-gray-500">
          This gallery has expired
        </p>

      </main>

    );

  }


if (!event) {

  return (

    <main className="min-h-screen flex items-center justify-center">

      <p className="text-gray-500">

        Gallery not published yet

      </p>

    </main>

  );

}



  return (

    <main className="min-h-screen bg-white">

      <div className="max-w-md mx-auto px-4 py-6">


        {/* Header */}

        <div className="mb-6">

          <h1 className="text-xl font-semibold">

            {event.name}

          </h1>

          <p className="text-xs text-gray-500">

            {media.length} photos •
            {" "}
            {daysLeft()} days remaining

          </p>

        </div>


        {/* Gallery Grid */}

        {media.length === 0 && (

          <p className="text-sm text-gray-500">

            No photos yet

          </p>

        )}


        <div className="grid grid-cols-2 gap-3">

          {media.map((item, index) => {

            const isVideo =
              item.file_url.includes("/video/");

            return (

              <div

                key={item.id}

                onClick={() =>
                  setActiveIndex(index)
                }

                className="cursor-pointer"

              >

                {isVideo ? (

                  <video
                    src={item.file_url}
                    className="rounded-lg w-full"
                  />

                ) : (

                  <img
                    src={item.file_url}
                    className="rounded-lg w-full"
                  />

                )}

              </div>

            );

          })}

        </div>


      </div>


      {/* Fullscreen Viewer */}

      {activeIndex !== null && (

        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">


          <button

            onClick={() =>
              setActiveIndex(null)
            }

            className="absolute top-6 right-6 text-white text-xl"

          >

            ✕

          </button>


          {media[activeIndex].file_url.includes("/video/")
            ?

            (

              <video

                src={media[activeIndex].file_url}

                controls
                autoPlay

                className="max-h-full max-w-full"

              />

            )

            :

            (

              <img

                src={media[activeIndex].file_url}

                className="max-h-full max-w-full"

              />

            )

          }


          <a

            href={media[activeIndex].file_url}

            download

            className="absolute bottom-8 bg-white text-black px-5 py-2 rounded-lg text-sm"

          >

            Download

          </a>


        </div>

      )}


    </main>

  );

}
