function isISODateString(value: any): boolean {
  if (typeof value !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value);
}

// Flatten an object into "key,value,key,value"
function flattenObject(obj: any): string {
  return Object.entries(obj)
    .map(([k, v]) => `${k},${v}`)
    .join(",");
}

export function jsonToToon(obj: any, indent = 0): string {
  const space = "  ".repeat(indent);
  let output = "";

  const isPrimitive = (v: any) =>
    v === null ||
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean";

  // 🟦 PRIMITIVES
  if (isPrimitive(obj)) {
    return `${obj}`;
  }

  // 🟧 ARRAYS
  if (Array.isArray(obj)) {
    return obj
      .map((item) => {
        const lineIndent = "  ".repeat(indent);

        if (isPrimitive(item) || isISODateString(item)) {
          return `${lineIndent}${item}`;
        }

        if (Array.isArray(item)) {
          // Nested array
          return `${lineIndent}${jsonToToon(item, indent + 1)}`;
        }

        // Object inside array → flatten
        if (typeof item === "object") {
          return `${lineIndent}${flattenObject(item)}`;
        }

        return `${lineIndent}${item}`;
      })
      .join("\n");
  }

  // 🟥 OBJECTS
  if (typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      const value = obj[key];

      // ISO date → print as normal
      if (isISODateString(value)) {
        output += `${space}${key},${value}\n`;
        continue;
      }

      // ARRAY
      if (Array.isArray(value)) {
        output += `${space}${key}[${value.length}],\n`;
        output += jsonToToon(value, indent + 1) + "\n";
        continue;
      }

      // OBJECT
      if (typeof value === "object" && value !== null) {
        output += `${space}${key},\n`;
        output += jsonToToon(value, indent + 1);
        continue;
      }

      // PRIMITIVE
      output += `${space}${key},${value}\n`;
    }
  }

  return output;
}
