import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

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

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 400 }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    const translation = await openai.audio.translations.create({
      file: file,
      model: "whisper-1",
    });

    if (!transcription.text || !translation.text) {
      return NextResponse.json(
        { success: false, message: "Failed to transcribe or translate" },
        { status: 500 }
      );
    }

    // Return the audios
    return NextResponse.json(
      {
        success: true,
        message: "Audios transcribed and translated successfully",
        transcription,
        translation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while transcribing audios", error);

    // Handle any errors that occur during the process
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
