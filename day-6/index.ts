import * as fs from "fs/promises";
import { join } from "path";

async function fetchInput(): Promise<string> {
  const contents = await fs.readFile(join(__dirname, "./input.txt"));

  return contents.toString();
}

interface IFile {
  name: string;
  size: number;
}

class Directory {
  #name: string;
  #parent: Directory | null;
  #directories: Directory[];
  #files: IFile[];

  get name(): string {
    return this.#name;
  }

  get parent(): Directory | null {
    return this.#parent;
  }

  get size(): number {
    const childDirSize = this.#directories
      .map((dir) => dir.size)
      .reduce((prev, next) => prev + next, 0);
    const filesSize = this.#files
      .map((f) => f.size)
      .reduce((prev, next) => prev + next, 0);

    return childDirSize + filesSize;
  }

  constructor(name: string, parent: Directory | null) {
    this.#name = name;
    this.#parent = parent;
    this.#directories = [];
    this.#files = [];
  }

  addDir(name: string): void {
    this.#directories.push(new Directory(name, this));
  }

  addFile(name: string, size: number): void {
    this.#files.push({
      name,
      size,
    });
  }

  findDir(name: string): Directory | undefined {
    return this.#directories.find((dir) => dir.name === name);
  }

  findFile(name: string): IFile | undefined {
    return this.#files.find((file) => file.name === name);
  }

  getDirectories(): Directory[] {
    return this.#directories
      .map((dir) => [dir, ...dir.getDirectories()])
      .reduce((prev, next) => [...prev, ...next], []);
  }
}

function run(input: string): any {
  const lines = input.split("\n").slice(1, -1);
  const root = new Directory("/", null);
  let currentDirectory: Directory = root;
  for (const line of lines) {
    if (line.startsWith("$ cd ")) {
      const dir = line.slice(5);
      if (dir === "..") {
        if (!currentDirectory.parent) {
          throw new Error("Trying to navigate outside root");
        }
        currentDirectory = currentDirectory.parent;
      } else {
        const targetDir = currentDirectory.findDir(dir);
        if (!targetDir) {
          throw new Error("Trying to navigate to unknown dir");
        }
        currentDirectory = targetDir;
      }
    } else if (line.startsWith("dir")) {
      const newDir = line.slice(4);
      const newDirRef = currentDirectory.findDir(newDir);
      if (!newDirRef) {
        currentDirectory.addDir(newDir);
      }
    } else if (/^\d+.*?$/.test(line)) {
      const [size, name] = line.split(" ");
      const fileRef = currentDirectory.findFile(name);
      if (!fileRef) {
        currentDirectory.addFile(name, Number(size));
      }
    }
  }

  const dirs = root.getDirectories();
  const dirsBelow = dirs.filter((dir) => dir.size <= 100000);
  console.log(
    "dirs size below 100000",
    dirsBelow.reduce((prev, next) => prev + next.size, 0)
  );

  const total = 70000000;
  const update = 30000000;

  const used = root.size;
  const free = total - used;
  const toDelete = update - free;

  const dirsToDelete = dirs
    .filter((dir) => dir.size >= toDelete)
    .sort((a, b) => a.size - b.size);

  console.log(dirsToDelete.map((d) => d.size));
}

async function main() {
  const input = await fetchInput();
  const result = run(input);

  console.log(result);
}

main();
