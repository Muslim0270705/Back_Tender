import { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";

function findPublicDir(startDir: string): string | null {
  let currentDir = startDir;

  while (true) {
    const potentialDir = path.join(currentDir, "public");
    if (
      fs.existsSync(potentialDir) &&
      fs.statSync(potentialDir).isDirectory()
    ) {
      return potentialDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  return null;
}

export default function handleRedirectIndex(
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (req.originalUrl === "/") return res.redirect(`/`);

  const publicDir = findPublicDir(__dirname);

  if (!publicDir) {
    return res.status(404).send("Public directory not found");
  }
  return res.sendFile(path.join(publicDir, "index.html"));
}
