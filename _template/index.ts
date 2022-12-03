import * as fs from "fs/promises";
import { join } from "path";

async function fetchInput(): Promise<string> {
  const contents = await fs.readFile(join(__dirname, "./input.txt"));

  return contents.toString();
}

function run(input: string): any {
  // Let's code
}

async function main() {
  const input = await fetchInput();
  const result = run(input);

  console.log(result);
}

main();
