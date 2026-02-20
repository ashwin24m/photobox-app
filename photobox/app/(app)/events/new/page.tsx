"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewEventPage(){

const supabase = getSupabase();

const router = useRouter();

const [eventName,setEventName]=useState("");
const [hostName,setHostName]=useState("");
const [loading,setLoading]=useState(false);

function generateCode(){

return Math.random()
.toString(36)
.substring(2,8)
.toUpperCase();

}

async function createEvent(){

if(!eventName || !hostName){

alert("Enter event name and host name");

return;

}

setLoading(true);

const code = generateCode();

const { error } = await supabase
.from("events")
.insert({
name:eventName,
host_name:hostName,
event_code:code,
gallery_enabled:true
});

setLoading(false);

if(error){

alert(error.message);
return;

}

router.push("/");

}

return(

<main className="max-w-xl mx-auto py-20 px-4 space-y-6">

<div className="text-3xl font-semibold">

Create Event

</div>

<input
placeholder="Event Name"
value={eventName}
onChange={e=>setEventName(e.target.value)}
className="w-full p-3 bg-white/5 border border-white/10 rounded-xl"
/>

<input
placeholder="Host Name"
value={hostName}
onChange={e=>setHostName(e.target.value)}
className="w-full p-3 bg-white/5 border border-white/10 rounded-xl"
/>

<button
onClick={createEvent}
disabled={loading}
className="w-full py-3 rounded-xl bg-gradient-to-b from-[#E7D3A3] to-[#C6A15B] text-black font-medium"
>

{loading ? "Creating..." : "Create Event"}

</button>

</main>

);

}
