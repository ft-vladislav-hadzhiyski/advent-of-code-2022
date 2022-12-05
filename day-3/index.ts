import * as fs from "fs/promises";
import { join } from "path";

async function fetchInput(): Promise<string> {
  const contents = await fs.readFile(join(__dirname, "./input.txt"));

  return contents.toString();
}

interface ISection {
  start: number;
  end: number;
}

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (v, k) => k + start);

function run(input: string): any {
  const lines = input.split("\n").slice(0, -1);
  const sections: ISection[][] = lines.map((line) => {
    const pairs = line.split(",");
    const first = pairs[0].split("-");
    const second = pairs[1].split("-");
    return [
      {
        start: Number(first[0]),
        end: Number(first[1]),
      },
      {
        start: Number(second[0]),
        end: Number(second[1]),
      },
    ];
  });

  const fullyOverlap = sections.filter(
    (section) =>
      (section[0].start <= section[1].start &&
        section[0].end >= section[1].end) ||
      (section[1].start <= section[0].start && section[1].end >= section[0].end)
  ).length;

  console.log("fully overlap count", fullyOverlap);

  const overlapAtAll = sections
    .map((section) => [
      range(section[0].start, section[0].end),
      range(section[1].start, section[1].end),
    ])
    .filter(
      (section) =>
        section[0].some((s0) => section[1].indexOf(s0) >= 0) ||
        section[1].some((s1) => section[0].indexOf(s1) >= 0)
    ).length;

  console.log("overlap at all", overlapAtAll);
}

async function main() {
  const input = await fetchInput();
  const result = run(input);

  console.log(result);
}

main();
