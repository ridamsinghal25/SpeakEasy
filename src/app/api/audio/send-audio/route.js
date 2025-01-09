import { NextResponse } from "next/server";
import connectToDB from "@/lib/connectToDB";
import AudioFile from "@/models/AudioFile";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { OPENAI_API_URL } from "@/constants";
import { extractTranscriptDetails } from "@/utils/transcript";
import axios from "axios";
import { getSystemPrompt } from "@/utils/systemPrompt";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  const { userId } = await auth();

  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized request" },
      { status: 401 }
    );
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Cloudinary credentials not found" },
      { status: 500 }
    );
  }

  // Connect to the database
  await connectToDB();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const language = formData.get("language");

    const fileType = file.type.split("/")[1];
    const fileSize = file.size;

    if (!file || !language) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // file size
    if (fileSize > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File size should be less than 5MB" },
        { status: 400 }
      );
    }

    // file type
    if (fileType !== "wav" && fileType !== "mp3" && fileType !== "mpeg") {
      return NextResponse.json(
        { success: false, message: "Invalid file type" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const format = fileType === "mpeg" ? "mp3" : fileType;

    // Construct the request data

    const data = {
      model: "gpt-4o-audio-preview",
      modalities: ["text", "audio"], // Specify output modalities (text-only for transcription and translation)
      audio: {
        voice: "alloy", // Optional for audio responses (omit if not generating audio output)
        format: "wav", // Ensure the audio format matches the uploaded file
      },
      messages: [
        {
          role: "system",
          content: getSystemPrompt(language),
        },
        {
          role: "user",
          content: [
            {
              type: "input_audio",
              input_audio: {
                data: base64,
                format: format, // Ensure the audio format is correct
              },
            },
          ],
        },
      ],
    };

    const response = await axios.post(OPENAI_API_URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const base64Audio = response.data?.choices[0]?.message?.audio?.data;

    // // Save the Base64 audio as a `.wav` file
    const audioBuffer = Buffer.from(base64Audio, "base64");

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video" },
        (error, result) => {
          if (error) {
            reject(error);
          } else resolve(result);
        }
      );
      uploadStream.end(audioBuffer);
    }).catch((error) => {
      console.log("Error in uploading audio to cloudinary", error.message);
      return NextResponse.json(
        { error: "Error in uploading audio to cloudinary" },
        { status: 500 }
      );
    });

    //  Parse the transcript and translation
    const transcriptRaw = response.data?.choices[0]?.message?.audio?.transcript;

    const { transcription, translation } =
      extractTranscriptDetails(transcriptRaw);

    // Return the API response (transcription and translation)
    const audioFile = await AudioFile.create({
      userId,
      dubbedAudioUrl: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      transcription,
      translation,
      language,
    });

    if (!audioFile) {
      return NextResponse.json(
        { success: false, message: "Error while storing audio file" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Audio file stored successfully",
        audioFile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in send-audio API route", error);
    return NextResponse.json(
      { success: false, message: "Request failed, please try again" },
      { status: 500 }
    );
  }
}
