import { NextResponse } from "next/server";
import connectToDB from "@/lib/connectToDB";
import AudioFile from "@/models/AudioFile";
import { auth } from "@clerk/nextjs/server";
import { getSystemPrompt } from "@/utils/systemPrompt";
import OpenAI from "openai";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

  // Check if Cloudinary credentials are provided
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
    // Extract the file and language from the request
    const formData = await request.formData();
    const file = formData.get("file");
    const language = formData.get("language");

    const fileType = file.type.split("/")[1];
    const fileSize = file.size;

    // Check if file and language are provided
    if (!file || !language) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if file size is less than 5MB
    if (fileSize > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File size should be less than 5MB" },
        { status: 400 }
      );
    }

    // Check if file type is supported
    if (fileType !== "wav" && fileType !== "mp3" && fileType !== "mpeg") {
      return NextResponse.json(
        { success: false, message: "Invalid file type" },
        { status: 400 }
      );
    }

    // Transcribe the audio
    const inputAudioTranscription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    // Check if transcription is successful
    if (!inputAudioTranscription) {
      return NextResponse.json(
        { success: false, message: "Error in processing audio" },
        { status: 500 }
      );
    }

    // Transcribe the audio using the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview",
      modalities: ["text", "audio"],
      audio: { voice: "alloy", format: "wav" },
      messages: [
        {
          role: "system",
          content: getSystemPrompt(language),
        },
        {
          role: "user",
          content: inputAudioTranscription.text,
        },
      ],
    });

    // Check if response is successful
    if (!response) {
      return NextResponse.json(
        { success: false, message: "Error in processing audio" },
        { status: 500 }
      );
    }

    // Extract the translation
    const outputAudioTranslation =
      response?.choices[0]?.message?.audio?.transcript;

    // Check if translation are present
    if (!outputAudioTranslation) {
      return NextResponse.json(
        {
          success: false,
          message: "Error in transcription or translation",
        },
        { status: 500 }
      );
    }

    // Convert the input audio file to base64 using arrayBuffer()
    const bytes = await file.arrayBuffer();
    const inputAudiobuffer = Buffer.from(bytes);

    // Extract the Base64 audio
    const outputAudioBase64Code = response?.choices[0]?.message?.audio?.data;

    // Check if Base64 audio is present
    if (!outputAudioBase64Code) {
      return NextResponse.json(
        { success: false, message: "Error in audio data" },
        { status: 500 }
      );
    }

    // Create the output audio buffer
    const outputAudioBuffer = Buffer.from(outputAudioBase64Code, "base64");

    const [sourceAudio, dubbedAudio] = await Promise.all([
      uploadToCloudinary(inputAudiobuffer, "video"),
      uploadToCloudinary(outputAudioBuffer, "video"),
    ]);

    if (!sourceAudio.public_id || !dubbedAudio.public_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Error while uploading audio to cloudinary",
        },
        { status: 500 }
      );
    }

    // Store the audio file in the database
    const audioFile = await AudioFile.create({
      userId,
      sourceAudioUrl: {
        public_id: sourceAudio.public_id,
        url: sourceAudio.secure_url,
      },
      dubbedAudioUrl: {
        public_id: dubbedAudio.public_id,
        url: dubbedAudio.secure_url,
      },
      transcription: inputAudioTranscription.text,
      translation: outputAudioTranslation,
      language,
    });

    // Check if audio file is stored
    if (!audioFile) {
      return NextResponse.json(
        { success: false, message: "Error while storing audio file" },
        { status: 500 }
      );
    }

    // Return the audio file
    return NextResponse.json(
      {
        success: true,
        message: "Audio file stored successfully",
        audioFile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in send-audio API route", error); // Log the error

    // Return an error response
    return NextResponse.json(
      { success: false, message: "Request failed, please try again" },
      { status: 500 }
    );
  }
}
