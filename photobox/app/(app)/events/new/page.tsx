"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function CreateEventPage() {

  const router = useRouter();
  const supabase = getSupabase();

  const [loading, setLoading] = useState(false);

  const [eventName, setEventName] = useState("");
  const [hostName, setHostName] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [selectedPlan, setSelectedPlan] = useState("medium");



  const plans = {

    small: {
      price: 499,
      storage: 5,
      guests: 100,
      validity: 7,
    },

    medium: {
      price: 999,
      storage: 15,
      guests: 300,
      validity: 30,
    },

    large: {
      price: 1999,
      storage: 50,
      guests: 800,
      validity: 90,
    },

  };



  async function handleCreateEvent() {

    if (!eventName || !hostName || !eventDate) {

      alert("Please fill all details");
      return;

    }

    setLoading(true);

    const plan = plans[selectedPlan as keyof typeof plans];


    const eventCode = crypto.randomUUID().replace(/-/g, "").slice(0, 10);



    const { data, error } = await supabase

      .from("events")

      .insert({

        name: eventName,

        host_name: hostName,

        event_date: eventDate,

        plan: selectedPlan,

        storage_limit_gb: plan.storage,

        guest_limit: plan.guests,

        validity_days: plan.validity,

        event_code: eventCode,

        payment_status: "pending",

      })

      .select()

      .single();



    setLoading(false);



    if (error) {

      alert("Error creating event");
      console.error(error);
      return;

    }



    // TEMP: Skip payment and go dashboard

    router.push("/events");

  }





  return (

    <main className="min-h-screen bg-[#0A0A0B] text-white">


      <div className="max-w-3xl mx-auto px-6 py-20">


        <h1 className="text-5xl font-[var(--font-playfair)] mb-10">

          Create Your Event

        </h1>

 <p className="text-white/60 mb-10">

          Enter event details and choose the suitable package

        </p>


        {/* Event Details */}



        <div className="space-y-6">


          <input

            value={eventName}

            onChange={(e) => setEventName(e.target.value)}

            placeholder="Event Name"

            className="w-full p-4 bg-white/5 border border-white/10 rounded-lg"

          />


          <input

            value={hostName}

            onChange={(e) => setHostName(e.target.value)}

            placeholder="Host Name"

            className="w-full p-4 bg-white/5 border border-white/10 rounded-lg"

          />


            <label className="block text-sm text-white/60 mb-2">

    Event Date

  </label>


  <input
    type="date"
    value={eventDate}
    onChange={(e) => setEventDate(e.target.value)}
    title="Select the event start date (Uploads will begin 24 hours before this selected date)"
    className="w-full p-4 bg-white/5 border border-white/10 rounded-lg"
  />


  <p className="text-xs text-white/40 mt-2">

    Select the event start date (Uploads will begin 24 hours before this date)

  </p>


        </div>




        {/* Packages */}



        <div className="mt-16 space-y-6">


          <PackageCard

            id="small"

            guests="Up to 100 Guests"

            price="₹499"

            selectedPlan={selectedPlan}

            setSelectedPlan={setSelectedPlan}

          />


          <PackageCard

            id="medium"

            guests="Up to 300 Guests"

            price="₹999"

            selectedPlan={selectedPlan}

            setSelectedPlan={setSelectedPlan}

          />


          <PackageCard

            id="large"

            guests="Up to 800 Guests"

            price="₹1999"

            selectedPlan={selectedPlan}

            setSelectedPlan={setSelectedPlan}

          />


        </div>




        {/* Payment Button */}



        <button

          onClick={handleCreateEvent}

          disabled={loading}

          className="mt-12 w-full bg-gradient-to-b from-[#E7D3A3] to-[#C6A15B] text-black py-5 rounded-xl text-lg font-semibold"

        >

          {loading ? "Creating Event..." : "Proceed to Payment"}

        </button>



      </div>


    </main>

  );

}





function PackageCard({

  id,

  guests,

  price,

  selectedPlan,

  setSelectedPlan,

}: any) {

  const active = selectedPlan === id;


  return (

    <div

      onClick={() => setSelectedPlan(id)}

      className={`p-6 border rounded-xl cursor-pointer

      ${active

        ? "border-[#C6A15B] bg-white/5"

        : "border-white/10"

      }`}

    >


      <div className="flex justify-between">


        <div>{guests}</div>

        <div className="text-[#C6A15B]">{price}</div>


      </div>


    </div>

  );

}
