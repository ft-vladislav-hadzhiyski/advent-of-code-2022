import * as fs from "fs";
import * as fsp from "fs/promises";
import { getCurrentDay, TEMPLATE_DIR } from "./shared";

async function main() {
  const currentDay = getCurrentDay();
  const currentDayFolderName = `day-${currentDay}`;

  if (await doesCurrentDayDirectoryExist(currentDayFolderName)) {
    console.log(
      `${currentDayFolderName} folder already exists. Run \`cd ${currentDayFolderName}\` and start coding ⌨️`
    );
  } else {
    await createCurrentDayDirectory(currentDayFolderName);
    console.log(`Let's get cracking day ${currentDay}`);
  }
}

async function doesCurrentDayDirectoryExist(currentDayFolderName: string) {
  return fs.existsSync(currentDayFolderName);
}

async function createCurrentDayDirectory(currentDayFolderName: string) {
  await fsp.cp(TEMPLATE_DIR, currentDayFolderName, { recursive: true });
}

main();
