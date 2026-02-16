import "./globals.css";

export const metadata = {
  title: "PhotoBox",
  description: "Private event photo sharing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <body>

        <header className="border-b">

          <div className="max-w-md mx-auto px-4 py-3 flex justify-between">

            <a href="/" className="font-medium">
              PhotoBox
            </a>

            <a href="/events" className="text-sm text-gray-500">
              Dashboard
            </a>

          </div>

        </header>

        {children}

      </body>

    </html>

  );

}
