import Link from "next/link";

export default function HomePage() {

  return (

    <main className="min-h-screen bg-white">

      <div className="max-w-md mx-auto px-6 py-12">

        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          PhotoBox
        </h1>

        <p className="text-gray-500 mb-10">
          Private event photo sharing
        </p>


        <div className="space-y-4">

          <Link
            href="/events"
            className="block w-full bg-black text-white py-4 rounded-lg text-center"
          >
            Host Dashboard
          </Link>


          <Link
            href="/join"
            className="block w-full border border-gray-300 py-4 rounded-lg text-center"
          >
            Join an Event
          </Link>

        </div>


        <p className="text-xs text-gray-400 mt-10 text-center">
          photobox.shadowlab.online
        </p>

      </div>

    </main>

  );

}
