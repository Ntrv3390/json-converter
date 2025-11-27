"use client";

import { useEffect, useState } from "react";

export default function PlaygroundPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [toonOutput, setToonOutput] = useState("");
  const [error, setError] = useState("");
  const [savedTokens, setSavedTokens] = useState<number | null>(null);

  const approxTokens = (text: string) => {
    return Math.ceil(text.trim().length / 4);
  };

  // ---------------------------------------------------------
  // AUTO CONVERT WHEN JSON IS VALID
  // ---------------------------------------------------------
  useEffect(() => {
    if (!jsonInput.trim()) {
      setError("");
      setToonOutput("");
      setSavedTokens(null);
      return;
    }

    let timeout = setTimeout(async () => {
      // Validate JSON
      let parsed;
      try {
        parsed = JSON.parse(jsonInput);
        setError("");
      } catch {
        setError("Invalid JSON format");
        setToonOutput("");
        setSavedTokens(null);
        return;
      }

      // Call backend conversion API
      const res = await fetch(
        `/api/convert?source=${process.env.NEXT_PUBLIC_PLAYGROUND_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({ json: parsed }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Conversion failed");
        setToonOutput("");
        setSavedTokens(null);
        return;
      }

      setToonOutput(data.toon);

      // Token savings
      const jsonTokens = approxTokens(jsonInput);
      const toonTokens = approxTokens(data.toon);
      const saved = jsonTokens - toonTokens;

      setSavedTokens(saved > 0 ? saved : 0);
    }, 500); // <- 500ms debounce

    return () => clearTimeout(timeout);
  }, [jsonInput]);

  // ---------------------------------------------------------
  // COPY FUNCTION
  // ---------------------------------------------------------
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6">JSON → TOON Playground</h2>

      {error && (
        <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* JSON INPUT */}
        <div className="relative">
          <textarea
            placeholder="Enter JSON here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-96 p-4 bg-gray-100 rounded-lg outline-none"
          />
          <button
            onClick={() => copy(jsonInput)}
            className="absolute top-2 right-2 bg-white shadow px-3 py-1 rounded"
          >
            Copy
          </button>
        </div>

        {/* TOON OUTPUT */}
        <div className="relative">
          <textarea
            placeholder="TOON output will appear here..."
            value={toonOutput}
            readOnly
            className="w-full h-96 p-4 bg-gray-100 rounded-lg outline-none"
          />
          <button
            onClick={() => copy(toonOutput)}
            className="absolute top-2 right-2 bg-white shadow px-3 py-1 rounded"
          >
            Copy
          </button>
        </div>
      </div>

      {/* TOKEN SAVINGS */}
      {savedTokens !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded text-green-700 font-medium">
          🎉 With this TOON format, you saved approximately{" "}
          <span className="font-bold">{savedTokens}</span> tokens!
          <br />
          {/* Cost Savings */}
          {(() => {
            const costPerToken = 0.000002; // <-- 1 token = $0.000002 (adjust anytime)
            const dollarsSaved = savedTokens * costPerToken;

            return (
              <span className="text-green-800">
                💰 Estimated cost saved:{" "}
                <span className="font-bold">${dollarsSaved.toFixed(6)}</span>
              </span>
            );
          })()}
        </div>
      )}
    </div>
  );
}
