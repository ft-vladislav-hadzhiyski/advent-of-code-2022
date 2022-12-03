import { getCurrentDay } from "./shared";
import { spawn } from "child_process";

async function main() {
  const currentDay = getCurrentDay();

  const child = spawn(`npx`, ['ts-node', 'index.ts'], {
    stdio: 'inherit',
    cwd: `./day-${currentDay}`,
  });

  child.on("error", (err) => {
    console.error(`day-${currentDay}/index.ts ERROR`, err);
  });

  child.on("data", (data) => {
    console.log(`day-${currentDay}> ${data}`);
  });
}

main();
