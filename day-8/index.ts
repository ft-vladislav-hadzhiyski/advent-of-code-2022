import * as fs from "fs/promises";
import { join } from "path";

type Knot = { x: number; y: number };
type Direction = "U" | "R" | "D" | "L";
const dirs = {
  U: [0, -1],
  R: [1, 0],
  D: [0, 1],
  L: [-1, 0],
};

const neighbors = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

async function fetchInput(): Promise<string> {
  const contents = await fs.readFile(join(__dirname, "./input.txt"));

  return contents.toString();
}

const areTouching = (a: Knot, b: Knot) => {
  return (
    (a.x === b.x && a.y === b.y) ||
    neighbors.some(
      (neighbor) => b.x + neighbor[0] === a.x && b.y + neighbor[1] === a.y
    )
  );
};

const moveKnot = (head: Knot, tail: Knot) => {
  const dx = head.x - tail.x;
  const dy = head.y - tail.y;
  const x = tail.x + dx / (Math.abs(dx) || 1);
  const y = tail.y + dy / (Math.abs(dy) || 1);

  return { x, y };
};

function run(input: string): any {
  const directions = input
    .split("\n")
    .slice(0, -1)
    .map((line) => {
      const [dir, count] = line.split(" ");

      return [dir, Number(count)] as [Direction, number];
    });

  solve(2, directions);
  solve(10, directions);
}

function solve(length: number, directions: [Direction, number][]) {
  const visited = new Set<string>(["0:0"]);

  let rope = Array.from({ length }, () => ({ x: 0, y: 0 }));

  for (let [dir, count] of directions) {
    while (count--) {
      for (let i = 0; i < rope.length - 1; i++) {
        if (i === 0) {
          rope[0].x += dirs[dir][0];
          rope[0].y += dirs[dir][1];
        }

        if (!areTouching(rope[i], rope[i + 1])) {
          rope[i + 1] = moveKnot(rope[i], rope[i + 1]);
        }
      }
      const tail = rope.at(-1) as Knot;
      visited.add(`${tail.x}:${tail.y}`);
    }
  }

  console.log(visited.size);
}

async function main() {
  const input = await fetchInput();
  const result = run(input);

  console.log(result);
}

main();
