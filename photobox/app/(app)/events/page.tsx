"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

type Event = {
  id: string;
  name: string;
  host_name: string;
  event_date: string;
  event_code: string;
  storage_limit_gb: number;
  validity_days: number;
  uploads_enabled: boolean;
  downloads_enabled: boolean;
};

type Media = {
  event_code: string;
  file_type: string;
  file_size: number;
  uploader_name: string | null;
  created_at: string;
};

export default function Dashboard() {

  const supabase = getSupabase();

  const [events, setEvents] = useState<Event[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);



useEffect(() => {

  initialize();

}, []);



  async function initialize() {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {

    location.href = "/login";
    return;

  }

  setUser(user);

  setLoadingUser(false); // THIS WAS MISSING

  load(user.id);

  const interval = setInterval(() => {

    load(user.id);

  }, 10000);

}





  async function load(userId: string) {

    if (!userId) return;



    const { data: e } = await supabase

      .from("events")

      .select("*")

      .eq("host_id", userId)

      .order("event_date", { ascending: false });



    const { data: m } = await supabase

      .from("media")

      .select("*")

      .order("created_at", { ascending: false });



    setEvents(e || []);

    setMedia(m || []);

  }



  async function logout() {

    await supabase.auth.signOut();

    location.href = "/login";

  }



  if (loadingUser)

    return (

      <main className="max-w-6xl mx-auto px-4 py-20 text-white/40">

        Loading Control Room...

      </main>

    );



  return (

    <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">



      <Header user={user} logout={logout} />



      {events.map(event => (

        <EventCard

          key={event.id}

          event={event}

          media={media.filter(m => m.event_code === event.event_code)}

          reload={() => load(user.id)}

        />

      ))}



    </main>

  );

}



function Header({ user, logout }: any) {

  return (

    <div className="flex justify-between items-center">



      <div>

        <div className="text-3xl font-[var(--font-playfair)]">

          Control Room

        </div>



        <div className="text-white/50 text-sm">

          {user.email}

        </div>



      </div>



      <div className="flex gap-3">



        <Link

          href="/events/new"

          className="px-4 py-2 rounded-lg bg-gradient-to-b from-[#E7D3A3] to-[#C6A15B] text-black"

        >

          Create Event

        </Link>



        <button

          onClick={logout}

          className="px-4 py-2 rounded-lg border border-white/20"

        >

          Logout

        </button>



      </div>



    </div>

  );

}



/* EVERYTHING BELOW UNCHANGED */

function EventCard({

  event,

  media,

  reload

}: {

  event: Event;

  media: Media[];

  reload: () => void;

}) {

  const supabase = getSupabase();



  async function toggle(field: "uploads_enabled" | "downloads_enabled") {

    await supabase

      .from("events")

      .update({

        [field]: !event[field]

      })

      .eq("id", event.id);



    reload();

  }



  const storageBytes = media.reduce((s, m) => s + (m.file_size || 0), 0);



  const storageGB = storageBytes / 1024 / 1024 / 1024;



  const percent = Math.min(

    100,

    (storageGB / event.storage_limit_gb) * 100

  );



  const photos = media.filter(m => m.file_type === "photo").length;

  const videos = media.filter(m => m.file_type === "video").length;

  const guests = new Set(media.map(m => m.uploader_name)).size;



  const lastUpload = media

    .map(m => new Date(m.created_at).getTime())

    .sort()

    .reverse()[0];



  const live = lastUpload && Date.now() - lastUpload < 120000;



  const expiry = expiryDays(event);



  return (

    <div className="border border-white/10 rounded-xl p-5 bg-gradient-to-br from-white/5 to-transparent space-y-4">



      <div className="flex justify-between items-center">

        <div>

          <div className="text-xl font-semibold">

            {event.name}

          </div>

          <div className="text-white/40 text-sm">

            {event.host_name}

          </div>

        </div>



        <Link

          href={`/events/${event.id}`}

          className="px-3 py-1 border border-white/20 rounded-lg text-sm"

        >

          Open

        </Link>

      </div>



      <div className="flex gap-6 text-xs">

        <Toggle

          label="Uploads"

          enabled={event.uploads_enabled}

          onClick={() => toggle("uploads_enabled")}

        />



        <Toggle

          label="Downloads"

          enabled={event.downloads_enabled}

          onClick={() => toggle("downloads_enabled")}

        />

      </div>



      <div className="grid grid-cols-2 gap-4">

        <StorageRing

          percent={percent}

          value={storageGB}

          limit={event.storage_limit_gb}

        />



        <div className="space-y-2">

          <Stat label="Photos" value={photos} color="#60A5FA" />

          <Stat label="Videos" value={videos} color="#A78BFA" />

          <Stat label="Guests" value={guests} color="#34D399" />

          <Stat label="Expiry" value={`${expiry}d`} color="#FBBF24" />

        </div>

      </div>



      <div className="flex justify-between text-xs">

        <div className={live ? "text-green-400" : "text-white/40"}>

          {live ? "● Live Uploading" : "Idle"}

        </div>



        <div className="text-white/40">

          {expiry} days remaining

        </div>

      </div>



      <ActivityTimeline media={media} />



    </div>

  );

}



function Toggle({ label, enabled, onClick }: any) {

  return (

    <div

      onClick={onClick}

      className="flex items-center gap-2 cursor-pointer select-none"

    >

      <div className="text-white/50">

        {label}

      </div>



      <div

        className={`w-10 h-5 rounded-full transition ${

          enabled

            ? "bg-gradient-to-r from-[#C6A15B] to-[#E7D3A3]"

            : "bg-white/20"

        }`}

      >

        <div

          className={`w-4 h-4 bg-black rounded-full mt-[2px] transition ${

            enabled ? "ml-5" : "ml-1"

          }`}

        />

      </div>

    </div>

  );

}



function StorageRing({ percent, value, limit }: any) {

  const radius = 42;

  const stroke = 6;

  const norm = radius * 2 * Math.PI;

  const offset = norm - percent / 100 * norm;



  return (

    <div className="flex flex-col items-center">

      <svg width="100" height="100">

        <circle

          stroke="#1f2937"

          fill="transparent"

          strokeWidth={stroke}

          r={radius}

          cx="50"

          cy="50"

        />



        <circle

          stroke="url(#grad)"

          fill="transparent"

          strokeWidth={stroke}

          strokeDasharray={norm}

          strokeDashoffset={offset}

          r={radius}

          cx="50"

          cy="50"

          strokeLinecap="round"

        />



        <defs>

          <linearGradient id="grad">

            <stop offset="0%" stopColor="#C6A15B" />

            <stop offset="100%" stopColor="#E7D3A3" />

          </linearGradient>

        </defs>

      </svg>



      <div className="text-xs text-white/50">

        {value.toFixed(1)} / {limit} GB

      </div>

    </div>

  );

}



function Stat({ label, value, color }: any) {

  return (

    <div className="flex justify-between text-sm">

      <span className="text-white/50">{label}</span>

      <span style={{ color }}>{value}</span>

    </div>

  );

}



function ActivityTimeline({ media }: { media: Media[] }) {

  const latest = [...media]

    .sort(

      (a, b) =>

        new Date(b.created_at).getTime() -

        new Date(a.created_at).getTime()

    )

    .slice(0, 4);



  return (

    <div>

      <div className="text-xs text-white/50 mb-2">

        Recent Activity

      </div>



      <div className="space-y-1">

        {latest.map((m, i) => (

          <div key={i} className="text-xs text-white/40">

            {m.uploader_name || "Guest"} uploaded {m.file_type}

          </div>

        ))}

      </div>

    </div>

  );

}



function expiryDays(event: Event) {

  const start = new Date(event.event_date).getTime();

  const end = start + event.validity_days * 86400000;



  return Math.max(

    0,

    Math.floor((end - Date.now()) / 86400000)

  );

}
