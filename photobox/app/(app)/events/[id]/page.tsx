"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function EventDetailPage() {

  const params = useParams();

  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);

  const [media, setMedia] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [storageUsed, setStorageUsed] = useState(0);


  async function loadEvent() {

    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    setEvent(data);

  }


async function loadMedia() {



  const { data } = await supabase
    .from("media")
    .select("*")
    .eq("event_id", eventId);

  setMedia(data || []);

  const total = (data || []).reduce(
  (sum, item) => sum + Number(item.file_size || 0),
  0
);


  setStorageUsed(total);
}



  useEffect(() => {

    if (eventId) {

      loadEvent();

      loadMedia();

      setLoading(false);

    }

  }, [eventId]);


  if (loading) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );

  }


  return (

    <main className="min-h-screen bg-white">

      <div className="max-w-md mx-auto px-4 py-6">


        <h1 className="text-xl font-semibold mb-2">
          {event?.name}
        </h1>

           <p className="text-sm text-gray-500 mb-6">
          Upload Link:
          <br />
          <span className="text-blue-600">
            /e/{event?.event_code}
          </span>
        </p>


        <h2 className="text-lg font-semibold mb-3">
          Uploaded Photos
        </h2>

<p className="text-sm text-gray-600 mb-4">

  Storage used: {(storageUsed / 1024 / 1024).toFixed(1)} MB

</p>

     <p className="text-xs text-gray-600">
  Raw bytes: {storageUsed}
</p>
        {media.length === 0 && (

          <p className="text-sm text-gray-500">
            No uploads yet
          </p>

        )}


        <div className="grid grid-cols-2 gap-3">

  {media.map((item) => {

    const isVideo = item.file_url.includes("/video/");

    async function approve() {

      await supabase
        .from("media")
        .update({ approved: true })
        .eq("id", item.id);

      loadMedia();

    }

    return (

      <div key={item.id}>

        {isVideo ? (

          <video
            src={item.file_url}
            controls
            className="rounded-lg w-full"
          />

        ) : (

          <img
            src={item.file_url}
            className="rounded-lg w-full"
          />

        )}

        {!item.approved && (

          <button
            onClick={approve}
            className="mt-1 w-full text-xs bg-black text-gray-700 py-1 rounded"
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

    </main>

  );

}
