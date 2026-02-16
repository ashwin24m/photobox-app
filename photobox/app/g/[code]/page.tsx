"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

const supabase = getSupabase();

import { useParams } from "next/navigation";

export default function PublicGalleryPage() {

  const params = useParams();

  const eventCode = params.code as string;

  const [event, setEvent] = useState<any>(null);

  const [media, setMedia] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);


  async function loadGallery() {

    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("event_code", eventCode)
      .single();

    if (!eventData) {

      setLoading(false);
      return;

    }

    setEvent(eventData);

    const { data: mediaData } = await supabase
      .from("media")
      .select("*")
      .eq("event_id", eventData.id)
      .eq("approved", true)
      .order("created_at", { ascending: false });

    setMedia(mediaData || []);

    setLoading(false);

  }


  useEffect(() => {

    loadGallery();

  }, []);


  if (loading) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );

  }


  if (!event) {

    return (
      <div className="p-6">
        Gallery not found
      </div>
    );

  }


  return (

    <main className="min-h-screen bg-white">

      <div className="max-w-md mx-auto px-4 py-6">


        <h1 className="text-xl font-semibold mb-4 text-gray-700">

          {event.name}

        </h1>


        <div className="grid grid-cols-2 gap-3">

  {media.map((item, index) => {

    const isVideo = item.file_url.includes("/video/");

    return (

      <div
        key={item.id}
        onClick={() => setActiveIndex(index)}
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



        {media.length === 0 && (

          <p className="text-sm text-gray-700 mt-4">

            No approved media yet

          </p>

        )}


      </div>

        {activeIndex !== null && (

  <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">

    <button
      onClick={() => setActiveIndex(null)}
      className="absolute top-4 right-4 text-gray-700 text-xl"
    >
      ✕
    </button>


    {media[activeIndex].file_url.includes("/video/") ? (

      <video
        src={media[activeIndex].file_url}
        controls
        autoPlay
        className="max-h-full max-w-full"
      />

    ) : (

      <img
        src={media[activeIndex].file_url}
        className="max-h-full max-w-full"
      />

    )}


    <a
      href={media[activeIndex].file_url}
      download
      className="absolute bottom-6 bg-white text-black px-4 py-2 rounded-lg"
    >
      Download
    </a>


  </div>

)}


    </main>

  );

}
