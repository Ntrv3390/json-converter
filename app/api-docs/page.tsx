"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function ApiDocsPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null; // should not happen due to middleware

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold mb-2">API Documentation</h1>

      <p className="text-gray-600 mb-6">
        Use your API key to convert JSON to TOON programmatically.
      </p>

      {/* Endpoint */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4 border">
        <h2 className="font-semibold mb-2">Endpoint</h2>
        <pre className="text-sm">
          {`
POST ${process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"}/api/convert
`}
        </pre>
      </div>

      {/* Headers */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4 border">
        <h2 className="font-semibold mb-2">Headers</h2>
        <pre className="text-sm">
          {`Authorization: Bearer ${user.apiKey}
Content-Type: application/json`}
        </pre>
      </div>

      {/* Request */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4 border">
        <h2 className="font-semibold mb-2">Request Body</h2>
        <pre className="text-sm">
          {`{
  "json": {
    "name": "John",
    "age": 25
  }
}`}
        </pre>
      </div>
      {/* Example Response */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4 border">
        <h2 className="font-semibold mb-2">Response Example</h2>
        <pre className="text-sm whitespace-pre-wrap">
          {`{
  "toon": "Name: John, Age: 25",
  "success": true
}`}
        </pre>
      </div>

      {/* API Key Display */}
      <div className="bg-gray-200 p-4 rounded-lg border mt-8">
        <p className="font-medium">Your API Key:</p>
        <code className="text-indigo-600 font-semibold break-all">
          {user.apiKey}
        </code>
      </div>
    </div>
  );
}
