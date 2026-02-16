"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {

  const [code, setCode] = useState("");

  const router = useRouter();


  function join() {

    if (!code) return;

    router.push("/e/" + code);

  }


  return (

    <main className="min-h-screen bg-white">

      <div className="max-w-md mx-auto px-6 py-12">

        <h1 className="text-xl font-semibold mb-6">

          Enter Event Code

        </h1>


        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="example: kabgpr"
          className="w-full border rounded-lg px-4 py-3 mb-4"
        />


        <button
          onClick={join}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Continue
        </button>


      </div>

    </main>

  );

}
