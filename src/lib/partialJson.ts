// Best-effort partial JSON parser for progressively streamed JSON.
// Completes open strings, closes dangling containers, and strips trailing
// half-written keys so React can render a card as it's being written.
export function parsePartialJSON<T = any>(raw: string): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { /* fall through */ }

  let inStr = false;
  let esc = false;
  const stack: string[] = [];
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (esc) { esc = false; continue; }
    if (c === "\\") { esc = true; continue; }
    if (inStr) {
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === "{" || c === "[") stack.push(c);
    else if (c === "}" || c === "]") stack.pop();
  }

  let s = raw;
  if (esc) s = s.slice(0, -1);
  if (inStr) s += '"';

  // Strip dangling structural bits: trailing comma, half-written key like ,"foo": or "foo":
  s = s.replace(/[,:]\s*$/, "");
  s = s.replace(/(,\s*)?"[^"]*"\s*:\s*$/, "");
  s = s.replace(/,\s*$/, "");

  const closers = stack
    .slice()
    .reverse()
    .map((o) => (o === "{" ? "}" : "]"))
    .join("");

  try {
    return JSON.parse(s + closers) as T;
  } catch {
    return null;
  }
}
