"use client";

import { useState } from "react";

export default function CreateEvent() {

  const [plan, setPlan] = useState("classic");

  return (

    <main className="max-w-3xl mx-auto py-20 px-6">


      <h1 className="text-4xl font-[var(--font-playfair)] mb-10">

        Create New Event

      </h1>


      {/* Event Name */}

      <input
        placeholder="Event Name"
        className="w-full mb-4 p-4 bg-white/5 border border-white/10 rounded-lg"
      />


      {/* Date */}

      <input
        type="date"
        className="w-full mb-4 p-4 bg-white/5 border border-white/10 rounded-lg"
      />


      {/* Plan Selection */}

      <div className="mb-10">

        <div className="mb-4">

          Select Plan

        </div>


        <div className="grid grid-cols-3 gap-4">


          <button
            onClick={() => setPlan("starter")}
            className={`p-4 border rounded ${
              plan === "starter" && "border-[#C6A15B]"
            }`}
          >
            ₹499
          </button>


          <button
            onClick={() => setPlan("classic")}
            className={`p-4 border rounded ${
              plan === "classic" && "border-[#C6A15B]"
            }`}
          >
            ₹999
          </button>


          <button
            onClick={() => setPlan("luxury")}
            className={`p-4 border rounded ${
              plan === "luxury" && "border-[#C6A15B]"
            }`}
          >
            ₹1999
          </button>


        </div>

      </div>



      {/* Payment Button */}


      <button className="w-full bg-[#C6A15B] text-black p-4 rounded-lg">

        Continue to Payment

      </button>



    </main>

  );

}
