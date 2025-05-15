export function optimizeCommandsRLE(commands: string): string {
  // Allowed commands:
  const allowed = new Set(["Л", "П", "В", "Н", "О", "Б"]);

  for (const ch of commands) {
    if (!allowed.has(ch)) throw new Error(`Invalid command: ${ch}`);
  }

  function rle(str: string): string {
    let result = "";
    let count = 1;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === str[i + 1]) {
        count++;
      } else {
        result += (count > 1 ? count : "") + str[i];
        count = 1;
      }
    }
    return result;
  }

  function groupRepeats(str: string): string {
    for (let size = 5; size >= 2; size--) {
      const regex = new RegExp(`((.{${size}}))\\1+`, "g");
      let match: RegExpExecArray | null;
      while ((match = regex.exec(str)) !== null) {
        const pattern = match[1];
        const count = match[0].length / size;
        const replacement = `${count}(${pattern})`;
        str = str.replace(match[0], replacement);
        regex.lastIndex = 0;
      }
    }
    return str;
  }

  const rleResult = rle(commands);
  const groupedResult = groupRepeats(rleResult);

  return groupedResult;
}
