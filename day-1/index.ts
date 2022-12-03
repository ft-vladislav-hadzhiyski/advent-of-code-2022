import * as fs from "fs/promises";
import { join } from "path";

async function fetchInput(): Promise<string> {
  const contents = await fs.readFile(join(__dirname, "./input.txt"));

  return contents.toString();
}

function run(input: string): any {
  const opTypePoints: { [t: string]: number } = {
    A: 1, // rock
    B: 2, // paper
    C: 3, // scissors
  };

  const typePoints: { [t: string]: number } = {
    X: 1, // rock
    Y: 2, // paper
    Z: 3, // scissors
  };

  const parsed = input
    .split("\n")
    .slice(0, -1)
    .map((i) => i.trim())
    .map((line) => line.split(" "))
    .map((moves) => [moves[0].toUpperCase(), moves[1].toUpperCase()]);

  const points = parsed.map(([op, me]) => {
    console.log(op, me);
    const myPoints = typePoints[me];
    let outcome = "";
    if (
      (op === "A" && me === "X") ||
      (op === "B" && me === "Y") ||
      (op === "C" && me === "Z")
    ) {
      outcome = "d";
    } else if (
      (op === "A" && me === "Y") ||
      (op === "B" && me === "Z") ||
      (op === "C" && me === "X")
    ) {
      outcome = "w";
    }
    if (outcome === "w") {
      return myPoints + 6;
    } else if (outcome === "d") {
      return myPoints + 3;
    } else {
      return myPoints;
    }
  });

  const sum = points.reduce((prev, next) => prev + next, 0);
  console.log("sum", sum); // 13526

  const points2 = parsed.map(([op, me]) => {
    const outcome = me === 'X' ? 'l' : me === 'Y' ? 'd' : 'w';
    if(outcome === 'd') {
      return opTypePoints[op] + 3;
    } else if (outcome === 'w') {
      if(op === 'A') {
        return 2 + 6;
      }
      if(op === 'B') {
        return 3 + 6;
      }
      if(op === 'C') {
        return 1 + 6;
      } 
    }

    if(op === 'A') {
      return 3 + 0;
    }
    if(op === 'B') {
      return 1 + 0;
    }
    if(op === 'C') {
      return 2 + 0;
    }

    return 0;
  });

  const sum2 = points2.reduce((prev, next) => prev + next, 0);
  console.log("sum2", sum2);
}

async function main() {
  const input = await fetchInput();
  const result = run(input);

  console.log(result);
}

main();
