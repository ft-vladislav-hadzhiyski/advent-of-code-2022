import * as fs from "fs/promises";
import { join } from "path";

async function fetchInput(): Promise<string> {
  const contents = await fs.readFile(join(__dirname, "./input.txt"));

  return contents.toString();
}

function run(input: string): any {
  const lines = input.split("\n").slice(0, -1);
  const trees = lines.map((line) => line.split("").map(Number));

  const visible = trees.map((currentRow, currentRowIndex, allTrees) => {
    if (currentRowIndex === 0 || currentRowIndex === allTrees.length - 1) {
      return currentRow.map((_r) => true);
    }

    return currentRow.map(
      (currentTreeInRow, currentTreeInRowIndex, allTreesInRow) => {
        if (
          currentTreeInRowIndex === 0 ||
          currentTreeInRowIndex === allTreesInRow.length - 1
        ) {
          return true;
        }

        const col = allTrees.reduce(
          (prev, next) => [...prev, next[currentTreeInRowIndex]],
          []
        );

        const leftTrees: number[] = allTrees[currentRowIndex].slice(
          0,
          currentTreeInRowIndex
        );
        const rightTrees: number[] = allTrees[currentRowIndex].slice(
          currentTreeInRowIndex + 1
        );
        const topTrees: number[] = col.slice(0, currentRowIndex);
        const bottomTrees: number[] = col.slice(currentRowIndex + 1);

        return (
          leftTrees.every((lt) => lt < currentTreeInRow) || // left
          rightTrees.every((rt) => rt < currentTreeInRow) || // right
          topTrees.every((tt) => tt < currentTreeInRow) || // top
          bottomTrees.every((bt) => bt < currentTreeInRow) // bottom
        );
      }
    );
  });

  console.log(
    "visible count",
    visible
      .reduce((prev, next) => [...prev, ...next], [])
      .filter((v) => v === true).length
  );

  const scenicScores: number[][] = trees.map(
    (currentRow, currentRowIndex, allTrees) => {
      return currentRow.map(
        (currentTreeInRow, currentTreeInRowIndex, _allTreesInRow) => {
          const col = allTrees.reduce(
            (prev, next) => [...prev, next[currentTreeInRowIndex]],
            []
          );

          const leftTrees: number[] = allTrees[currentRowIndex]
            .slice(0, currentTreeInRowIndex)
            .reverse();
          const rightTrees: number[] = allTrees[currentRowIndex].slice(
            currentTreeInRowIndex + 1
          );
          const topTrees: number[] = col.slice(0, currentRowIndex).reverse();
          const bottomTrees: number[] = col.slice(currentRowIndex + 1);

          const leftScore = getScore(leftTrees, currentTreeInRow);
          const rightScore = getScore(rightTrees, currentTreeInRow);
          const topScore = getScore(topTrees, currentTreeInRow);
          const bottomScore = getScore(bottomTrees, currentTreeInRow);

          return [leftScore, rightScore, topScore, bottomScore].reduce(
            (p, n) => p * n,
            1
          );
        }
      );
    }
  );
  console.log(
    "max scenic score",
    scenicScores
      .reduce((prev, next) => [...prev, ...next], [])
      .sort((a, b) => b - a)[0]
  );
}

function getScore(trees: number[], target: number) {
  let score = 0;
  for (const tree of trees) {
    if (tree < target) {
      score += 1;
    }

    if (tree >= target) {
      score += 1;
      break;
    }
  }
  return score;
}

async function main() {
  const input = await fetchInput();
  const result = run(input);

  console.log(result);
}

main();
