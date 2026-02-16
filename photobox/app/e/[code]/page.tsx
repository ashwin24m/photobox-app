"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function EventUploadPage() {

  const params = useParams();

  const eventCode = params.code as string;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [eventId, setEventId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  const [ready, setReady] = useState(false);


  async function continueToUpload() {

    if (!name || !phone) {
      alert("Enter name and phone");
      return;
    }

    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("event_code", eventCode)
      .single();

    if (!event) {
      alert("Event not found");
      return;
    }

    setEventId(event.id);

    const { data: attendee } = await supabase
      .from("attendees")
      .insert([
        {
          event_id: event.id,
          name,
          phone,
        },
      ])
      .select()
      .single();

    setReady(true);

  }


  async function handleUpload(e: any) {

  if (!eventId) return;

  const file = e.target.files[0];

  if (!file) return;

  // NEW: Check storage limit

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();


  const { data: media } = await supabase
    .from("media")
    .select("file_size")
    .eq("event_id", eventId);


  const used = (media || []).reduce(
    (sum, item) => sum + Number(item.file_size || 0),
    0
  );

  const limit = event.storage_limit_gb * 1024 * 1024 * 1024;

  if (used + file.size > limit) {

    alert("Storage limit reached");

    return;

  }}

  // continue upload below



  return (

    <main className="min-h-screen bg-white">

      <div className="max-w-md mx-auto px-4 py-6 text-gray-700">


        {!ready && (

          <div className="space-y-4">

            <h1 className="text-xl font-semibold">

              Enter Your Details

            </h1>


            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-gray-700"
            />


            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 text-gray-700"
            />


            <button
              onClick={continueToUpload}
              className="w-full bg-black text-gray-700 py-3 rounded-lg"
            >
              Continue
            </button>

          </div>

        )}


        {ready && (

          <div>

            <h1 className="text-xl font-semibold mb-4 text-gray-700" >
              Upload Photos
            </h1>


            <input
              type="file"
              onChange={handleUpload}
              className="w-full"
            />


            {uploading && (
              <p className="mt-4 text-sm ">
                Uploading...
              </p>
            )}

          </div>

        )}


      </div>

    </main>

  );

}
