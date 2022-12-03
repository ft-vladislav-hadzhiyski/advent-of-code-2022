import * as fs from "fs/promises";
import { join } from "path";

async function fetchInput(): Promise<string> {
  const contents = await fs.readFile(join(__dirname, "./input.txt"));

  return contents.toString();
}

function run(input: string): any {
  const inputLines = input.split("\n");
  const elves: number[][] = [];
  let i = 0;
  for (const line of inputLines) {
    if (line === "") {
      i += 1;
      continue;
    }
    if (elves[i] === undefined) {
      elves[i] = [Number(line)];
    } else {
      elves[i].push(Number(line));
    }
  }

  const elvesCalories = elves.reduce(
    (prev, next) => [...prev, next.reduce((sum, ne) => sum + ne)],
    []
  );
  const max = elvesCalories.reduce((prev, next) => (prev < next ? next : prev));
  const top3Total = elvesCalories
    .sort((a, b) => a - b)
    .reverse()
    .slice(0, 3)
    .reduce((sum, next) => sum + next);

  console.log("max", max);
  console.log("top3total", top3Total);
}

async function main() {
  const input = await fetchInput();
  const result = run(input);

  console.log(result);
}

main();
