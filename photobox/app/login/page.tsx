"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const supabase = getSupabase();

  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  async function handleLogin() {

    setLoading(true);

    setError("");


    const { data, error } = await supabase.auth.signInWithPassword({

      email: email.trim(),

      password: password.trim()

    });


    if (error) {

      setError(error.message);

      setLoading(false);

      return;

    }


    router.push("/events");

  }



  return (

    <main className="max-w-md mx-auto px-4 py-20 space-y-6">



      <div className="text-3xl font-[var(--font-playfair)]">

        Login

      </div>



      <input

        type="email"

        placeholder="Email"

        value={email}

        onChange={e => setEmail(e.target.value)}

        className="w-full p-3 bg-black/30 border border-white/10 rounded-xl"

      />



      <input

        type="password"

        placeholder="Password"

        value={password}

        onChange={e => setPassword(e.target.value)}

        className="w-full p-3 bg-black/30 border border-white/10 rounded-xl"

      />



      {error && (

        <div className="text-red-400 text-sm">

          {error}

        </div>

      )}



      <button

        onClick={handleLogin}

        disabled={loading}

        className="w-full py-3 rounded-xl bg-gradient-to-b from-[#E7D3A3] to-[#C6A15B] text-black font-semibold"

      >

        {loading ? "Logging in..." : "Login"}

      </button>



    </main>

  );

}
