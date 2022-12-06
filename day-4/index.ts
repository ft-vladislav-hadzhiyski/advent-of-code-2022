import * as fs from "fs/promises";
import { join } from "path";

async function fetchInput(fileName: string): Promise<string> {
  const contents = await fs.readFile(join(__dirname, fileName));

  return contents.toString();
}

interface IInstruction {
  count: number;
  from: number;
  to: number;
}

function transpose(matrix: any[][]): any[][] {
  return matrix.reduce(
    (prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])),
    []
  );
}

function run(input: string): any {
  const lines = input.split("\n").slice(0, -1);
  const separatorIndex = lines.findIndex((line) => line === "");

  const crateLines = lines
    .slice(0, separatorIndex - 1)
    .map((line) =>
      line.split(/[\[\]]/g).filter((ch) => ch !== "" && ch !== " ")
    )
    .reduce<string[][]>(
      (prev, next) => [
        ...prev,
        next.reduce<string[]>((pn, nn) => {
          const sp: string[] =
            nn.length === 1
              ? [nn]
              : new Array(
                  nn.length % 4 === 0 ? nn.length / 4 : (nn.length - 1) / 4
                ).fill(" ");
          return [...pn, ...sp];
        }, []),
      ],
      []
    );

  const crates: string[][] = transpose(crateLines).map((crate) =>
    crate.map((cr) => cr.trim()).filter(Boolean)
  );

  const instructions: IInstruction[] = lines
    .slice(separatorIndex + 1)
    .map((line) => {
      const match = new RegExp(/move\s*(\d+)\s*from\s*(\d+)\s*to\s*(\d+)/).exec(
        line
      )!;
      return {
        count: Number(match[1]),
        from: Number(match[2]) - 1,
        to: Number(match[3]) - 1,
      };
    });

  const crates1 = [...crates.map((crate) => [...crate])];
  moveCrates1(instructions, crates1);

  const crates2 = [...crates.map((crate) => [...crate])];
  moveCrates2(instructions, crates2);
}

function moveCrates1(instructions: IInstruction[], crates: string[][]) {
  for (const instruction of instructions) {
    for (let j = 0; j < instruction.count; j += 1) {
      const el = crates[instruction.from].shift();
      if (el) {
        crates[instruction.to].unshift(el);
      }
    }
  }

  const top = crates.map((crate) => crate[0]).join("");
  console.log("top", top);
}

function moveCrates2(instructions: IInstruction[], crates: string[][]) {
  for (const instruction of instructions) {
    const from = crates[instruction.from].splice(0, instruction.count);
    crates[instruction.to] = [...from, ...crates[instruction.to]];
  }

  const top = crates.map((crate) => crate[0]).join("");
  console.log("top", top);
}

async function main() {
  // const input = await fetchInput("./example.txt");
  const input = await fetchInput("./input.txt");
  const result = run(input);

  console.log(result);
}

main();
