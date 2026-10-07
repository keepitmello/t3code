import { describe, expect, it } from "vite-plus/test";

import { markdownWithTableBoundaries } from "./markdownTableBoundaries";

describe("markdownWithTableBoundaries", () => {
  it("separates both tables from the preceding bold captions in the reported message", () => {
    const source = [
      "**작은 선택까지 루가 하면**",
      "| | 숫자 |",
      "|---|---|",
      "| 반응 속도 | 보통 4~8.5초 |",
      "",
      "돌아다닐 때 깨는 횟수가 확 늘어.",
      "",
      "**제브를 붙이면**",
      "| | 루가 직접 | 제브 |",
      "|---|---|---|",
      "| 작은 선택 속도 | 4~8.5초 | 보통 0.7초 |",
    ].join("\n");
    expect(markdownWithTableBoundaries(source)).toBe(
      source.replace("**\n|", "**\n\n|").replace("붙이면**\n|", "붙이면**\n\n|"),
    );
  });

  it.each([
    "Caption\nName | Value\n--- | ---\na | b",
    "Caption\n| Name | Value |\n| :--- | ---: |\n| a | b |",
    "Caption\n| Name | Value |\r\n| :---: | --- |\r\n| a | b |",
    "Caption\n| Name\\|alias | Value |\n| --- | --- |\n| a | b |",
  ])("adds only the missing boundary and is idempotent: %s", (source) => {
    const result = markdownWithTableBoundaries(source);
    expect(result).toBe(source.replace("Caption\n", "Caption\n\n"));
    expect(markdownWithTableBoundaries(result)).toBe(result);
  });

  it.each([
    "| Name | Value |\n| --- | --- |\n| a | b |",
    "Caption\n\n| Name | Value |\n| --- | --- |\n| a | b |",
    "Caption\n| Name | Value |\n| --- |\n| a | b |",
    "Caption\n| Name | Value |\n| not | a delimiter |",
    "Caption\nName\\|Value\n---\\|---",
    "Caption\n    | Name | Value |\n    | --- | --- |",
    "Caption\n\t| Name | Value |\n\t| --- | --- |",
    "```md\nCaption\n| Name | Value |\n| --- | --- |\n```",
    "~~~~md\nCaption\n| Name | Value |\n| --- | --- |\n~~~\n| a | b |\n~~~~",
    "````md\n```\nCaption\n| Name | Value |\n| --- | --- |\n````",
    "Caption\n| Name | Value |\n| ---",
    "Plain text\nwith soft breaks\nand **bold** text.",
  ])("preserves existing tables, code, prose and incomplete tables: %s", (source) => {
    expect(markdownWithTableBoundaries(source)).toBe(source);
  });
});
