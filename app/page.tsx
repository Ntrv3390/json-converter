export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-4">
        Convert <span className="text-indigo-600">JSON</span> to TOON in a
        second
      </h1>

      <p className="text-gray-600 mb-8">
        Simple, fast & free JSON → TOON converter
      </p>

      <div className="flex gap-4">
        <a
          href="/playground"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Playground
        </a>

        <a
          href="/api-docs"
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          API Docs
        </a>
      </div>
    </div>
  );
}
