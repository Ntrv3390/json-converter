"use client";

import toast from "react-hot-toast";

export default function CopyButton({ textSelector }: { textSelector: string }) {
  const handleCopy = () => {
    const el = document.querySelector(
      textSelector
    ) as HTMLTextAreaElement | null;

    if (!el) {
      toast.error("Nothing to copy");
      return;
    }

    navigator.clipboard.writeText(el.value);
    toast.success("Copied!");
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 bg-white shadow px-3 py-1 rounded text-sm hover:bg-gray-50"
    >
      Copy
    </button>
  );
}
