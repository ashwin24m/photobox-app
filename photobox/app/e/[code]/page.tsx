"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import Image from "next/image";

const CLOUD = "dprtb7jzl";
const PRESET = "photobox_unsigned";

type UploadItem = {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "done" | "failed";
  type: "photo" | "video";
};

export default function UploadPage() {

  const { code } = useParams();

  const supabase = getSupabase();

  const [event, setEvent] = useState<any>();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [identified, setIdentified] = useState(false);

  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const [myMedia, setMyMedia] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [guestCount, setGuestCount] = useState(0);


  useEffect(() => {

    init();

  }, []);



  async function init() {

    const { data } = await supabase

      .from("events")
      .select("*")
      .eq("event_code", code)
      .single();

    setEvent(data);


    const savedName = localStorage.getItem(`pb_name_${code}`);
    const savedPhone = localStorage.getItem(`pb_phone_${code}`);

    if (savedName && savedPhone) {

      setName(savedName);
      setPhone(savedPhone);
      setIdentified(true);

      loadMyMedia(savedName, savedPhone);

    }

    loadActivity();
    subscribeRealtime();

  }



  function subscribeRealtime() {

    supabase

      .channel("media_live")

      .on(

        "postgres_changes",

        {
          event: "INSERT",
          schema: "public",
          table: "media",
        },

        payload => {

          const m = payload.new;

          loadActivity();

          if (

            m.uploader_name === name &&
            m.uploader_phone === phone

          ) {

            loadMyMedia(name, phone);

          }

        }

      )

      .subscribe();

  }



  async function loadMyMedia(n: string, p: string) {

    const { data } = await supabase

      .from("media")

      .select("*")

      .eq("event_code", code)

      .eq("uploader_name", n)

      .eq("uploader_phone", p)

      .order("created_at", { ascending: false });

    setMyMedia(data || []);

  }



  async function loadActivity() {

    const { data } = await supabase

      .from("media")

      .select("*")

      .eq("event_code", code)

      .order("created_at", { ascending: false })

      .limit(10);

    setActivity(data || []);

    const guests = new Set(

      (data || []).map(m => m.uploader_phone)

    );

    setGuestCount(guests.size);

  }



  function identify() {

    localStorage.setItem(`pb_name_${code}`, name);
    localStorage.setItem(`pb_phone_${code}`, phone);

    setIdentified(true);

    loadMyMedia(name, phone);

  }



function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {

  if (!e.target.files) return;

  const files = Array.from(e.target.files) as File[];

  files.forEach((file: File) => startUpload(file));

}



  function startUpload(file: File) {

    const id = crypto.randomUUID();

    const type = file.type.startsWith("video")
      ? "video"
      : "photo";


    setUploads(prev => [

      ...prev,

      {
        id,
        file,
        progress: 0,
        status: "uploading",
        type
      }

    ]);


    const xhr = new XMLHttpRequest();

    const form = new FormData();

    form.append("file", file);
    form.append("upload_preset", PRESET);


xhr.open(
"POST",
`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`
);

    xhr.upload.onprogress = e => {

      const percent = (e.loaded / e.total) * 100;

      setUploads(prev =>
        prev.map(u =>
          u.id === id
            ? { ...u, progress: percent }
            : u
        )
      );

    };


    xhr.onload = async () => {

      if (xhr.status !== 200) {

        setUploads(prev =>
          prev.map(u =>
            u.id === id
              ? { ...u, status: "failed" }
              : u
          )
        );

        return;
      }


      const res = JSON.parse(xhr.response);


      await supabase.from("media").insert({

        event_code: code,

        file_url: res.secure_url,

        file_type:
          res.resource_type === "video"
            ? "video"
            : "photo",

        file_size: res.bytes,

        uploader_name: name,

        uploader_phone: phone,

        status: "pending",

      });


      setUploads(prev =>
        prev.map(u =>
          u.id === id
            ? { ...u, status: "done", progress: 100 }
            : u
        )
      );

    };


    xhr.onerror = () => {

      setUploads(prev =>
        prev.map(u =>
          u.id === id
            ? { ...u, status: "failed" }
            : u
        )
      );

    };


    xhr.send(form);

  }



  if (!event) return null;



  const done = uploads.filter(u => u.status === "done");

  const photos = done.filter(u => u.type === "photo");

  const videos = done.filter(u => u.type === "video");



  return (

    <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">



      <div>

        <div className="text-3xl font-[var(--font-playfair)]">

          {event.name}

        </div>

        <div className="text-[#C6A15B] text-sm">

          {guestCount} guests contributing

        </div>

      </div>



      {!identified && (

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">

          <input

            placeholder="Your Name"

            value={name}

            onChange={e => setName(e.target.value)}

            className="w-full p-3 bg-black/30 rounded"

          />

          <input

            placeholder="Phone Number"

            value={phone}

            onChange={e => setPhone(e.target.value)}

            className="w-full p-3 bg-black/30 rounded"

          />

          <button

            onClick={identify}

            className="w-full py-3 bg-gradient-to-b from-[#E7D3A3] to-[#C6A15B] text-black rounded-xl"

          >

            Continue

          </button>

        </div>

      )}



      {identified && (

        <>

          <label className="block border border-[#C6A15B]/40 rounded-xl p-10 text-center cursor-pointer hover:bg-white/5">

            Upload Photos or Videos

            <input

              type="file"

              multiple

              accept="image/*,video/*"

              onChange={handleFiles}

              className="hidden"

            />

          </label>



          {uploads.map(u => (

            <div key={u.id}>

              {u.file.name}

              <div className="h-2 bg-white/10 rounded">

                <div

                  style={{ width: `${u.progress}%` }}

                  className="h-full bg-[#C6A15B]"

                />

              </div>

            </div>

          ))}



          {done.length > 0 && (

            <div className="text-[#C6A15B]">

              {done.length} files uploaded

              ({photos.length} photos, {videos.length} videos)

            </div>

          )}



          <div className="grid grid-cols-3 gap-3">

            {myMedia.map((m, i) => (

              <div key={i} className="relative aspect-square">

                {m.file_type === "video" ? (

                  <video src={m.file_url} controls />

                ) : (

                  <Image

                    src={m.file_url}

                    alt=""

                    fill

                    sizes="33vw"

                    className="object-cover rounded"

                  />

                )}

              </div>

            ))}

          </div>



        </>

      )}



    </main>

  );

}
