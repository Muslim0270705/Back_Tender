import fs from "fs";

const exists = async (filePath: string) =>
  !!(await fs.promises.stat(filePath).catch((e) => {
    if (process.env.DEBUG_MODE === "true") {
      console.debug(e);
    }
    return false;
  }));

const deleteFile = async (filePath: string) =>
  await fs.promises.unlink(filePath).catch((e) => {
    if (process.env.DEBUG_MODE === "true") {
      console.debug(e);
    }
    return false;
  });

const listDir = async (dirPath: string) =>
  await fs.promises.readdir(dirPath).catch((e) => {
    if (process.env.DEBUG_MODE === "true") {
      console.debug(e);
    }
    return [];
  });

const write = async (filePath: string, content: string) =>
  await fs.promises.writeFile(filePath, content, "utf8");

const read = async (filePath: string) =>
  await fs.promises.readFile(filePath, "utf8");

// require("fs").readFile("FILE.TXT", "utf8", (err, data) => { console.log(data); });

const File = { exists, deleteFile, listDir, write, read };

export default File;
