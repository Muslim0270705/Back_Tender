import { UploadedFile } from "express-fileupload";
import File from "../utils/file";

type ITypeFile = "image" | "file";

export interface ISaveFileResult {
  error: boolean;
  dbFileName: string;
}

interface ISaveFile {
  path: string;
  fileName: string;
  sampleFile: UploadedFile;
  ALLOWED_EXTENSIONS?: string[]; 
  type: ITypeFile;
  allowTypePrefix?: boolean;
}

async function saveFile({
  path,
  fileName,
  sampleFile,
  ALLOWED_EXTENSIONS = ["pdf", "docx", "doc", "xlsx", "jpg", "jpeg", "png"],
  type,
  allowTypePrefix = true,
}: ISaveFile): Promise<ISaveFileResult> {
  try {
    const ext = sampleFile.name.split(".").pop()?.toLowerCase(); 
    if (!ext) return { error: true, dbFileName: "" };

    if (!ALLOWED_EXTENSIONS.includes(ext))
      return { error: true, dbFileName: "" };

    const mimeType = sampleFile.mimetype;
    const allowedMimeTypes = {
      image: ["image/jpeg", "image/png", "image/jpg"],
      file: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      ],
    };

    if (type === "image" && !allowedMimeTypes.image.includes(mimeType)) {
      return { error: true, dbFileName: "" };
    }

    if (type === "file" && !allowedMimeTypes.file.includes(mimeType)) {
      return { error: true, dbFileName: "" };
    }

    const name = `${fileName}.${ext}`;
    const realUploadPath = `${path}${allowTypePrefix ? `${type}-` : ""}${name}`;

    await sampleFile.mv(realUploadPath);

    return { error: false, dbFileName: name };
  } catch (error) {
    console.log("error saveFile: ", error.message);
    return { error: true, dbFileName: "" };
  }
}

async function removeFile(path: string, fileName: string) {
  File.deleteFile(`${path}${fileName}`);
}

const FileService = {
  saveFile,
  removeFile,
};

export default FileService;
  