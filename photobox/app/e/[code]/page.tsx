"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

const supabase = getSupabase();

export default function EventUploadPage() {

  const params = useParams();
  const eventCode = params.code as string;

  const [event, setEvent] = useState<any>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [eventId, setEventId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [ready, setReady] = useState(false);

  const [expired, setExpired] = useState(false);

  useEffect(() => {

    loadEvent();

  }, []);

  async function loadEvent() {

    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("event_code", eventCode)
      .single();

    if (!data) return;

    if (
      data.expiry_date &&
      new Date(data.expiry_date).getTime() < Date.now()
    ) {

      setExpired(true);
      return;

    }

    setEvent(data);

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

  async function continueToUpload() {

    if (!name || !phone || !event) {

      alert("Enter name and phone");
      return;

    }

    setEventId(event.id);

    await supabase
      .from("attendees")
      .insert([
        {
          event_id: event.id,
          name,
          phone
        }
      ]);

    setReady(true);

  }


  async function handleUpload(e: any) {

    if (!eventId) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // storage check

    const { data: media } = await supabase
      .from("media")
      .select("file_size")
      .eq("event_id", eventId);

    const used =
      (media || []).reduce(
        (sum, m) => sum + Number(m.file_size || 0),
        0
      );

    const limit =
      event.storage_limit_gb * 1024 * 1024 * 1024;

    if (used + file.size > limit) {

      alert("Storage limit reached");
      setUploading(false);
      return;

    }

    // upload to cloudinary

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      "photobox"
    );

    const res = await fetch(

      `https://api.cloudinary.com/v1_1/dprtb7jzl/auto/upload`,
      {
        method: "POST",
        body: formData
      }

    );

    const uploadData = await res.json();

    await supabase
      .from("media")
      .insert([

        {
          event_id: eventId,
          file_url: uploadData.secure_url,
          file_size: file.size,
          approved: false
        }

      ]);

    setUploading(false);

    alert("Uploaded");

  }


  if (expired) {

    return (

      <main className="min-h-screen bg-white flex items-center justify-center">

        <p className="text-gray-500">
          This event has expired
        </p>

      </main>

    );

  }


  return (

    <main className="min-h-screen bg-white">

      <div className="max-w-md mx-auto px-4 py-6 text-gray-800">


        {/* Event Header */}

        {event && (

          <div className="mb-6">

            <h1 className="text-xl font-semibold">

              {event.name}

            </h1>

            <p className="text-xs text-gray-500">

              Upload photos • {daysLeft()} days left

            </p>

          </div>

        )}


        {/* Attendee form */}

        {!ready && (

          <div className="space-y-4">

            <input
              placeholder="Your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              placeholder="Phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />

            <button
              onClick={continueToUpload}
              className="w-full bg-black text-white py-3 rounded-lg"
            >

              Continue

            </button>

          </div>

        )}


        {/* Upload */}

        {ready && (

          <div>

            <h2 className="font-medium mb-4">
              Select photo or video
            </h2>

            <input
              type="file"
              onChange={handleUpload}
              className="w-full"
            />

            {uploading && (

              <p className="text-sm mt-3 text-gray-500">

                Uploading...

              </p>

            )}

          </div>

        )}


      </div>

    </main>

  );

}
