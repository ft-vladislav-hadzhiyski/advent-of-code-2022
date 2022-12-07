import * as fs from "fs/promises";
import { join } from "path";

async function fetchInput(): Promise<string> {
  const contents = await fs.readFile(join(__dirname, "./input.txt"));

  return contents.toString();
}

const areDifferent = (chunk: string[]): boolean => {
  return new Set<string>(chunk).size === chunk.length;
};

function run(input: string): any {
  const stream = input.slice(0, -1).split("");

  const startOfPacket = findMarkerIndex(stream, 4);
  console.log("start-of-packet marker", startOfPacket);

  const startOfMessage = findMarkerIndex(stream, 14);
  console.log("start-of-message marker", startOfMessage);
}

function findMarkerIndex(stream: string[], chunkSize: number) {
  for (let i = 0; i < stream.length; i += 1) {
    const chunk = stream.slice(i, i + chunkSize);

    if (chunk.length === chunkSize && areDifferent(chunk)) {
      return i + chunkSize;
    }
  }

  return -1;
}

async function main() {
  const input = await fetchInput();
  const result = run(input);

  console.log(result);
}

main();
