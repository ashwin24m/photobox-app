"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

import { useRouter } from "next/navigation";

export default function CreateEventPage() {

  const supabase = getSupabase();

  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [checking, setChecking] = useState(true);

  const [isNewUser, setIsNewUser] = useState(false);



  const [form, setForm] = useState({

    name: "",

    phone: "",

    email: "",

    password: "",

    event_name: "",

    event_date: "",

  });



  useEffect(() => {

    init();

  }, []);




  async function init() {

    const {

      data: { user }

    } = await supabase.auth.getUser();



    if (user) {

      setUser(user);

      await loadProfile(user.id);

      setIsNewUser(false);

    } else {

      setIsNewUser(true);

    }



    setChecking(false);

  }




  async function loadProfile(id: string) {

    const { data } = await supabase

      .from("profiles")

      .select("*")

      .eq("id", id)

      .single();



    if (data) {

      setForm(prev => ({

        ...prev,

        name: data.name,

        phone: data.phone,

        email: data.email,

      }));

    }

  }




  function handleChange(e: any) {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  }




  async function handleSubmit() {

    setLoading(true);

    let userId = user?.id;



    // NEW USER SIGNUP

    if (isNewUser) {

      const { data, error } = await supabase.auth.signUp({

        email: form.email,

        password: form.password,

      });



      if (error) {

        alert(error.message);

        setLoading(false);

        return;

      }



      userId = data.user?.id;



      // Save profile

      await supabase.from("profiles").insert({

        id: userId,

        name: form.name,

        phone: form.phone,

        email: form.email

      });



      // Redirect cleanly to event creation

      router.refresh();



      setUser(data.user);

      setIsNewUser(false);

      setLoading(false);

      return;

    }




    // CREATE EVENT

    const code = crypto.randomUUID().slice(0, 8);



    await supabase.from("events").insert({

      host_id: userId,

      name: form.event_name,

      host_name: form.name,

      event_date: form.event_date,

      event_code: code,

      storage_limit_gb: 15,

      validity_days: 30,

      uploads_enabled: true,

      downloads_enabled: true

    });



    router.push("/events");

  }




  if (checking) return null;




  return (

    <main className="max-w-xl mx-auto px-4 py-10 space-y-6">



      <div className="text-3xl font-[var(--font-playfair)]">

        {isNewUser

          ? "Create Account"

          : "Create Event"}

      </div>




      <Input

        name="name"

        placeholder="Your Name"

        value={form.name}

        onChange={handleChange}

        disabled={!isNewUser}

      />



      <Input

        name="phone"

        placeholder="Phone Number"

        value={form.phone}

        onChange={handleChange}

        disabled={!isNewUser}

      />



      <Input

        name="email"

        placeholder="Email"

        value={form.email}

        onChange={handleChange}

        disabled={!isNewUser}

      />



      {isNewUser && (

        <Input

          name="password"

          type="password"

          placeholder="Password"

          value={form.password}

          onChange={handleChange}

        />

      )}



      {!isNewUser && (

        <>

          <Input

            name="event_name"

            placeholder="Event Name"

            value={form.event_name}

            onChange={handleChange}

          />



          <Input

            name="event_date"

            type="date"

            value={form.event_date}

            onChange={handleChange}

          />

        </>

      )}




      <button

        onClick={handleSubmit}

        disabled={loading}

        className="w-full py-3 rounded-xl bg-gradient-to-b from-[#E7D3A3] to-[#C6A15B] text-black font-semibold"

      >

        {loading

          ? "Please wait..."

          : isNewUser

          ? "Create Account"

          : "Create Event"}

      </button>



    </main>

  );

}



function Input(props: any) {

  return (

    <input

      {...props}

      className="w-full p-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-[#C6A15B]"

    />

  );

}
