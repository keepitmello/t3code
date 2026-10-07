/**
 * MD4C only recognizes a table when its header is the first line of a paragraph.
 * GFM also allows a table to interrupt a paragraph. Supply that boundary without
 * changing the stored message, table cells, or fenced/indented code.
 */
export function markdownWithTableBoundaries(markdown: string): string {
  const lines = markdown.split("\n");
  const output: string[] = [];
  let fence: { marker: string; length: number } | null = null;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]!;
    const fenceMatch = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence) {
      output.push(line);
      if (
        fenceMatch?.[1]?.[0] === fence.marker &&
        fenceMatch[1].length >= fence.length &&
        fenceMatch[2]?.trim() === ""
      ) {
        fence = null;
      }
      continue;
    }
    if (fenceMatch && !(fenceMatch[1]![0] === "`" && fenceMatch[2]!.includes("`"))) {
      fence = { marker: fenceMatch[1]![0]!, length: fenceMatch[1]!.length };
      output.push(line);
      continue;
    }

    const delimiter = lines[index + 1];
    if (
      index > 0 &&
      lines[index - 1]!.trim() !== "" &&
      delimiter !== undefined &&
      !/^(?: {4}|\t)/.test(line) &&
      !/^(?: {4}|\t)/.test(delimiter)
    ) {
      const headerCells = tableCells(line);
      const delimiterCells = tableCells(delimiter);
      if (
        headerCells &&
        delimiterCells &&
        headerCells.length === delimiterCells.length &&
        delimiterCells.every((cell) => /^:?-+:?$/.test(cell.trim()))
      ) {
        output.push("");
      }
    }
    output.push(line);
  }
  return output.join("\n");
}

function tableCells(line: string): string[] | null {
  const cells = line.trim().split(/(?<!\\)(?:\\\\)*\|/);
  if (cells.length < 2) return null;
  if (cells[0] === "") cells.shift();
  if (cells.at(-1) === "") cells.pop();
  return cells.length > 0 ? cells : null;
}
