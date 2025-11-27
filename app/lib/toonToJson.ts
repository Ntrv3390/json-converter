export function toonToJson(toon: string): any {
  const lines = toon.split("\n");

  function parseValue(v: string): any {
    if (v === "null") return null;
    if (v === "true") return true;
    if (v === "false") return false;
    if (!isNaN(Number(v))) return Number(v);
    return v;
  }

  // ----------------------------------------------------
  // PARSE BLOCK (OBJECT or ARRAY)
  // ----------------------------------------------------
  function parseBlock(
    start: number,
    indent: number
  ): { value: any; next: number } {
    let obj: any = {};
    let i = start;

    while (i < lines.length) {
      const raw = lines[i];
      if (raw == null) break;

      const trimmed = raw.trim();
      const match = raw.match(/^ */);
      const leading = match ? match[0].length : 0;

      if (leading < indent) break;
      if (trimmed === "") {
        i++;
        continue;
      }

      // ----------------------------------------------------
      // INLINE TABLE ARRAY:
      // users[2]{id,name,role}:
      // ----------------------------------------------------
      const inlineTable = trimmed.match(/^([A-Za-z0-9_]+)\[(\d+)\]\{(.+)\}:/);
      if (inlineTable) {
        const key = inlineTable[1];
        const headers = inlineTable[3].split(",");

        i++;
        const arr: any[] = [];

        while (i < lines.length) {
          const rowLine = lines[i].trim();
          if (!/^\d+/.test(rowLine)) break;

          const parts = rowLine.split(",");
          const objRow: any = {};
          headers.forEach((h, idx) => {
            objRow[h] = parseValue(parts[idx]);
          });

          arr.push(objRow);
          i++;
        }

        obj[key] = arr;
        continue;
      }

      // ----------------------------------------------------
      // OBJECT FIELD: key:
      // ----------------------------------------------------
      const matchObj = trimmed.match(/^([^:]+):\s*(.*)$/);
      if (matchObj) {
        const key = matchObj[1];
        const val = matchObj[2];

        // Nested object or array
        if (val === "") {
          const parsed = parseBlock(i + 1, leading + 2);
          obj[key] = parsed.value;
          i = parsed.next;
          continue;
        }

        // Primitive key: value
        obj[key] = parseValue(val);
        i++;
        continue;
      }

      i++;
    }

    return { value: obj, next: i };
  }

  return parseBlock(0, 0).value;
}
