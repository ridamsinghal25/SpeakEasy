import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from "@uploadcare/rest-client";

export default function NextFileUploader({ onUploadComplete }) {
  const fileTypeLimit = (fileInfo) => {
    const allowedTypes = ["audio/mp3", "audio/wav", "audio/mpeg"];

    if (!fileInfo || !fileInfo.name) {
      return {
        message: "Invalid file information.",
      };
    }

    const mimeType = fileInfo.mimeType; // Assuming fileInfo has a "type" property

    if (!mimeType || !allowedTypes.includes(mimeType)) {
      return {
        message: "Only .mp3 and .wav files are allowed.",
      };
    }
  };

  const handleDelete = async (fileUUID) => {
    const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
      publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY,
      secretKey: process.env.NEXT_PUBLIC_UPLOADCARE_SECRET_KEY,
    });

    try {
      await deleteFile(
        {
          uuid: fileUUID,
        },
        { authSchema: uploadcareSimpleAuthSchema }
      );
    } catch (error) {}
  };

  return (
    <FileUploaderRegular
      pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
      maxLocalFileSizeBytes={5000000}
      fileValidators={[fileTypeLimit]}
      multiple={false}
      accept=".mp3,.wav,"
      onFileUploadSuccess={onUploadComplete}
      onDoneClick={(file) => {
        const fileUUID = file.allEntries[0].uuid;
        handleDelete(fileUUID);
      }}
      onFileRemoved={(file) => handleDelete(file.uuid)}
    />
  );
}
