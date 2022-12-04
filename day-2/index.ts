import * as fs from "fs/promises";
import { join } from "path";

async function fetchInput(): Promise<string> {
  const contents = await fs.readFile(join(__dirname, "./input.txt"));

  return contents.toString();
}

interface IRuckSack {
  full: string[];
  left: string[];
  right: string[];
}

function getPriority(char: string): number {
  const code = char.charCodeAt(0);
  if (code >= 97) {
    return code - 96;
  }
  if (code >= 65) {
    return code - 38;
  }
  return -1;
}

function run(input: string): any {
  const lines = input.split("\n").slice(0, -1);
  const rucksacks: IRuckSack[] = lines.map((line) => {
    const middle = line.length / 2;
    const lineSymbols = line.split("");
    return {
      full: lineSymbols,
      left: lineSymbols.slice(0, middle),
      right: lineSymbols.slice(middle),
    };
  });

  const shared = rucksacks
    .map((sack) => {
      const dup = new Set<string>();
      for (const char of sack.left) {
        if (sack.right.indexOf(char) >= 0) {
          dup.add(char);
        }
      }
      const values = Array.from(dup.values());
      return values[0];
    })
    .filter((v) => Boolean(v));

  const priorities = shared.map(getPriority);

  const prioritiesSum = priorities.reduce((prev, next) => prev + next, 0);

  console.log("priorities sum", prioritiesSum);

  const groups = rucksacks.reduce<IRuckSack[][]>((prev, next, i) => {
    const ch = Math.floor(i / 3);
    prev[ch] = new Array<IRuckSack>().concat(
      prev[ch] || new Array<IRuckSack>(),
      next
    );
    return prev;
  }, []);

  const groupSymbols = groups.map((group) => {
    return group[0].full.filter(
      (ch) => group[1].full.indexOf(ch) >= 0 && group[2].full.indexOf(ch) >= 0
    )[0];
  });

  const groupPriorities = groupSymbols.map(getPriority);
  const groupPrioritySum = groupPriorities.reduce(
    (prev, next) => prev + next,
    0
  );

  console.log("group priorities sum", groupPrioritySum);
}

async function main() {
  const input = await fetchInput();
  const result = run(input);

  console.log(result);
}

main();
