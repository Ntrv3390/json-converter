function isISODateString(value: any): boolean {
  if (typeof value !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value);
}

export function jsonToToon(obj: any, indent = 0): string {
  const space = "  ".repeat(indent);
  let out = "";

  const isPrimitive = (v: any) =>
    v === null ||
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean";

  // -----------------------------
  // PRIMITIVE
  // -----------------------------
  if (isPrimitive(obj) || isISODateString(obj)) {
    return `${obj}`;
  }

  // -----------------------------
  // ARRAY
  // -----------------------------
  if (Array.isArray(obj)) {
    if (obj.length === 0) return `${space}[]`;

    const allObjects = obj.every(
      (item) => typeof item === "object" && item !== null && !Array.isArray(item)
    );

    // ---------------------------------------
    // CASE 1: ARRAY OF OBJECTS
    // ---------------------------------------
    if (allObjects) {
      const firstKeys = Object.keys(obj[0]);

      const allSameKeys = obj.every(
        (item) =>
          JSON.stringify(Object.keys(item)) === JSON.stringify(firstKeys)
      );

      // ----- TABLE MODE (same keys)
      if (allSameKeys) {
        out += `${space}[${obj.length}]{${firstKeys.join(",")}}:\n`;

        obj.forEach((item) => {
          const row = firstKeys.map((k) => item[k]).join(",");
          out += `${space}  ${row}\n`;
        });

        return out.trimEnd();
      }

      // ----- EXPANDED MODE (different keys)
      out += `${space}[${obj.length}]:\n`;
      obj.forEach((item) => {
        out += `${space}  -\n`;
        for (const [k, v] of Object.entries(item)) {
          if (isPrimitive(v) || isISODateString(v)) {
            out += `${space}    ${k}: ${v}\n`;
          } else if (Array.isArray(v)) {
            out += `${space}    ${k}:\n`;
            out += jsonToToon(v, indent + 3) + "\n";
          } else {
            out += `${space}    ${k}:\n`;
            out += jsonToToon(v, indent + 3) + "\n";
          }
        }
      });

      return out.trimEnd();
    }

    // ---------------------------------------
    // CASE 2: PRIMITIVE / MIXED ARRAY
    // ---------------------------------------
    out += `${space}[${obj.length}]:\n`;
    obj.forEach((item) => {
      out += `${space}  ${jsonToToon(item, indent + 1)}\n`;
    });

    return out.trimEnd();
  }

  // -----------------------------
  // OBJECT
  // -----------------------------
  if (typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      const val = obj[key];

      // PRIMITIVE
      if (isPrimitive(val) || isISODateString(val)) {
        out += `${space}${key}: ${val}\n`;
        continue;
      }

      // ARRAY
      if (Array.isArray(val)) {
        const arrayFormatted = jsonToToon(val, indent + 1);

        out += `${space}${key}:\n`;
        out += arrayFormatted + "\n";
        continue;
      }

      // OBJECT
      out += `${space}${key}:\n`;
      out += jsonToToon(val, indent + 1) + "\n";
    }

    return out.trimEnd();
  }

  return `${obj}`;
}
