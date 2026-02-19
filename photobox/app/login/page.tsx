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

  const [signup, setSignup] = useState(false);



  async function handle() {

    setLoading(true);

    if (signup) {

      const { error } = await supabase.auth.signUp({

        email,
        password

      });

      if (!error) {

        alert("Account created. Please login.");

        setSignup(false);

      }

    } else {

      const { error } = await supabase.auth.signInWithPassword({

        email,
        password

      });

      if (!error) {

        router.push("/events");

      }

    }

    setLoading(false);

  }



  return (

    <main className="max-w-md mx-auto px-4 py-20">

      <div className="text-3xl font-[var(--font-playfair)] mb-6">

        {signup ? "Create Account" : "Login"}

      </div>



      <div className="space-y-4">

        <input

          placeholder="Email"

          value={email}

          onChange={e => setEmail(e.target.value)}

          className="w-full p-3 bg-black/30 border border-white/10 rounded"

        />



        <input

          placeholder="Password"

          type="password"

          value={password}

          onChange={e => setPassword(e.target.value)}

          className="w-full p-3 bg-black/30 border border-white/10 rounded"

        />



        <button

          onClick={handle}

          disabled={loading}

          className="w-full py-3 bg-gradient-to-b from-[#E7D3A3] to-[#C6A15B] text-black rounded-xl"

        >

          {loading ? "Please wait..." : signup ? "Create Account" : "Login"}

        </button>



        <button

          onClick={() => setSignup(!signup)}

          className="text-white/50 text-sm"

        >

          {signup

            ? "Already have account? Login"

            : "Create new account"}

        </button>

      </div>

    </main>

  );

}
