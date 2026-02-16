import Link from "next/link";

export default function HomePage() {

  return (

    <main className="min-h-screen bg-white text-gray-800">

      <div className="max-w-md mx-auto px-6 py-12">

        {/* Brand */}

        <h1 className="text-3xl font-semibold mb-2">
          PhotoBox
        </h1>

        <p className="text-gray-500 mb-10">
          Private event photo sharing. Controlled. Secure. Elegant.
        </p>


        {/* Host Section */}

        <div className="mb-8">

          <p className="text-xs uppercase text-gray-400 mb-2">
            For Hosts
          </p>

          <Link
            href="/events"
            className="block w-full bg-black text-white py-4 rounded-lg text-center"
          >
            Open Dashboard
          </Link>

        </div>


        {/* Guest Section */}

        <div className="mb-8">

          <p className="text-xs uppercase text-gray-400 mb-2">
            For Guests
          </p>

          <Link
            href="/join"
            className="block w-full border border-gray-300 py-4 rounded-lg text-center"
          >
            Join an Event
          </Link>

        </div>


        {/* Info */}

        <div className="text-xs text-gray-400 mt-10 space-y-1">

          <p>
            Upload photos securely
          </p>

          <p>
            Host approves before sharing
          </p>

          <p>
            Automatic expiry after event
          </p>

        </div>


      </div>

    </main>

  );

}
