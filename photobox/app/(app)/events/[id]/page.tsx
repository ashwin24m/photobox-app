"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Image from "next/image";

type Event = {
  id: string;
  name: string;
  host_name: string;
  event_date: string;
  event_code: string;
  storage_limit_gb: number;
  guest_limit: number;
  payment_status: string;
};

type Media = {
  id: string;
  file_url: string;
  status: string;
};

export default function EventControlPage() {

  const { id } = useParams();

  const supabase = getSupabase();

  const [event, setEvent] = useState<Event | null>(null);

  const [media, setMedia] = useState<Media[]>([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    loadEvent();

  }, []);




  async function loadEvent() {

    const { data: eventData } = await supabase

      .from("events")

      .select("*")

      .eq("id", id)

      .single();



    setEvent(eventData);



    if (eventData) {

      const { data: mediaData } = await supabase

        .from("media")

        .select("*")

        .eq("event_code", eventData.event_code)

        .order("created_at", { ascending: false });



      setMedia(mediaData || []);

    }



    setLoading(false);

  }




  async function approveMedia(mediaId: string) {

    await supabase

      .from("media")

      .update({ status: "approved" })

      .eq("id", mediaId);



    loadEvent();

  }




  async function deleteMedia(mediaId: string) {

    await supabase

      .from("media")

      .delete()

      .eq("id", mediaId);



    loadEvent();

  }




  if (loading) {

    return (

      <main className="max-w-6xl mx-auto px-4 py-10">

        Loading...

      </main>

    );

  }




  if (!event) {

    return (

      <main className="max-w-6xl mx-auto px-4 py-10">

        Event not found

      </main>

    );

  }



  const uploadLink = `${window.location.origin}/e/${event.event_code}`;

  const galleryLink = `${window.location.origin}/g/${event.event_code}`;




  return (

    <main className="max-w-6xl mx-auto px-4 py-10">



      {/* Header */}



      <div className="mb-8">


        <h1 className="text-3xl font-[var(--font-playfair)]">

          {event.name}

        </h1>


        <div className="text-white/60 mt-2">

          Host: {event.host_name}

        </div>


      </div>




      {/* Links */}



      <div className="grid sm:grid-cols-2 gap-4 mb-8">


        <LinkBox

          title="Upload Link"

          link={uploadLink}

        />


        <LinkBox

          title="Gallery Link"

          link={galleryLink}

        />


      </div>




      {/* Media */}



      <div>


        <h2 className="text-xl mb-4">

          Uploaded Media

        </h2>



        {media.length === 0 && (

          <div className="text-white/40">

            No uploads yet

          </div>

        )}



        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">


          {media.map((item) => (

            <div

              key={item.id}

              className="border border-white/10 rounded-lg overflow-hidden"

            >


              <Image

                src={item.file_url}

                alt="media"

                width={300}

                height={300}

                className="object-cover"

              />



              <div className="p-2 space-y-2">


                {item.status !== "approved" && (

                  <button

                    onClick={() => approveMedia(item.id)}

                    className="w-full text-sm bg-green-600 py-1 rounded"

                  >

                    Approve

                  </button>

                )}



                <button

                  onClick={() => deleteMedia(item.id)}

                  className="w-full text-sm bg-red-600 py-1 rounded"

                >

                  Delete

                </button>


              </div>


            </div>

          ))}


        </div>


      </div>



    </main>

  );

}






function LinkBox({

  title,

  link,

}: {

  title: string;

  link: string;

}) {


  async function copy() {

    await navigator.clipboard.writeText(link);

    alert("Copied");

  }



  return (

    <div className="border border-white/10 rounded-lg p-4">


      <div className="text-sm text-white/60">

        {title}

      </div>


      <div className="text-sm mt-2 break-all">

        {link}

      </div>


      <button

        onClick={copy}

        className="mt-3 px-3 py-1 border border-white/20 rounded text-sm"

      >

        Copy

      </button>


    </div>

  );

}
