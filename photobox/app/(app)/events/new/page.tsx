"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewEventPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);


  async function createEvent() {

    if (!name) {
      alert("Enter event name");
      return;
    }

    setLoading(true);

    const eventCode = Math.random().toString(36).substring(2, 8);

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          name: name,
          description: description,
          event_code: eventCode,
          storage_limit_gb: 15,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Event created");

    router.push("/events");

  }


  return (

    <main className="min-h-screen bg-white">

      <div className="max-w-md mx-auto px-4 py-6">

        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Create New Event
        </h2>


        <div className="space-y-4">

          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-gray-700"
          />


          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-gray-700"
          />


          <button
            onClick={createEvent}
            className="w-full bg-black text-white py-3 rounded-lg"
          >

            {loading ? "Creating..." : "Create Event"}

          </button>

        </div>

      </div>

    </main>

  );

}
