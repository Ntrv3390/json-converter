"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PlaygroundPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [toonOutput, setToonOutput] = useState("");
  const [error, setError] = useState("");
  const [savedTokens, setSavedTokens] = useState<number | null>(null);

  const approxTokens = (text: string) => {
    return Math.ceil(text.trim().length / 4);
  };

  const jsonTokens = approxTokens(jsonInput);
  const toonTokens = approxTokens(toonOutput);

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
      const jsonT = approxTokens(jsonInput);
      const toonT = approxTokens(data.toon);
      const saved = jsonT - toonT;

      setSavedTokens(saved > 0 ? saved : 0);
    }, 500);

    return () => clearTimeout(timeout);
  }, [jsonInput]);

  // Copy helper
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  // % savings
  const percentSaved =
    savedTokens && jsonTokens > 0
      ? ((savedTokens / jsonTokens) * 100).toFixed(2)
      : "0";

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

          {/* JSON Token Count */}
          <p className="text-sm text-gray-600 mt-2">
            Tokens: <span className="font-semibold">{jsonTokens}</span>
          </p>
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

          {/* TOON Token Count + % Savings */}
          <p className="text-sm text-gray-600 mt-2">
            Tokens: <span className="font-semibold">{toonTokens}</span>{" "}
            {savedTokens !== null && (
              <span className="text-green-700 ml-2">
                (Saved {percentSaved}%)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* TOTAL SAVINGS BOX */}
      {savedTokens !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded text-green-700 font-medium">
          🎉 With this TOON format, you saved approximately{" "}
          <span className="font-bold">{savedTokens}</span> tokens!
          <br />
          {(() => {
            const costPerToken = 0.000002;
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
