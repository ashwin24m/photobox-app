"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

const supabase = getSupabase();

export default function EventDetailPage() {

  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

    const [publishing, setPublishing] = useState(false);

  const [storageUsed, setStorageUsed] =
    useState(0);


  useEffect(() => {

    load();

  }, []);


  async function load() {

    const { data: eventData } =
      await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

    setEvent(eventData);


    const { data: mediaData } =
      await supabase
        .from("media")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", {
          ascending: false
        });

    setMedia(mediaData || []);


    const total =
      (mediaData || []).reduce(

        (sum, item) =>
          sum + Number(item.file_size || 0),

        0

      );

    setStorageUsed(total);

  }


  async function approve(id: string) {

    await supabase
      .from("media")
      .update({ approved: true })
      .eq("id", id);

    load();

  }


  function formatMB(bytes: number) {

    return (bytes / 1024 / 1024)
      .toFixed(1);

  }


  async function togglePublish() {

  setPublishing(true);

  await supabase
    .from("events")
    .update({
      is_published: !event.is_published
    })
    .eq("id", eventId);

  load();

  setPublishing(false);

}



  return (

    <main className="min-h-screen bg-white">

      <div className="max-w-md mx-auto px-4 py-6">


        {/* Event Header */}

        <div className="mb-6">

          <h1 className="text-xl font-semibold">

            {event?.name}

          </h1>

          <p className="text-xs text-gray-500">

            Storage used:
            {" "}
            {formatMB(storageUsed)} MB

          </p>

<button
  onClick={togglePublish}
  className="mt-3 w-full bg-black text-white py-2 rounded-lg text-sm"
>

  {event?.is_published
    ? "Gallery Published"
    : "Publish Gallery"}

</button>


        </div>


        {/* Media Grid */}

        <div className="grid grid-cols-2 gap-3">

          {media.map((item, index) => {

            const isVideo =
              item.file_url.includes("/video/");

            return (

              <div key={item.id}>


                <div

                  onClick={() =>
                    setActiveIndex(index)
                  }

                  className="cursor-pointer"

                >

                  {isVideo

                    ?

                    (

                      <video
                        src={item.file_url}
                        className="rounded-lg w-full"
                      />

                    )

                    :

                    (

                      <img
                        src={item.file_url}
                        className="rounded-lg w-full"
                      />

                    )

                  }

                </div>


                {!item.approved && (

                  <button

                    onClick={() =>
                      approve(item.id)
                    }

                    className="mt-1 w-full bg-black text-white text-xs py-1 rounded"

                  >

                    Approve

                  </button>

                )}


                {item.approved && (

                  <p className="text-xs text-green-600 mt-1">

                    Approved

                  </p>

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


        </div>

      )}


    </main>

  );

}
