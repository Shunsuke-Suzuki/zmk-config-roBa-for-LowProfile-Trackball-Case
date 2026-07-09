/** Returns the index of the closing `}` matching `{` at `openBraceIndex`. */
export function findMatchingBrace(content: string, openBraceIndex: number): number {
  if (content[openBraceIndex] !== "{") {
    throw new Error(`Expected '{' at index ${openBraceIndex}`);
  }

  let depth = 0;
  for (let i = openBraceIndex; i < content.length; i++) {
    const ch = content[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }

  throw new Error("Unbalanced braces in keymap content");
}

export function findTrackballBlockRange(content: string): { start: number; end: number } | null {
  const marker = "&trackball";
  const start = content.indexOf(marker);
  if (start === -1) return null;

  const openBrace = content.indexOf("{", start);
  if (openBrace === -1) return null;

  const closeBrace = findMatchingBrace(content, openBrace);
  let end = closeBrace + 1;
  if (content[end] === ";") end++;

  return { start, end };
}
