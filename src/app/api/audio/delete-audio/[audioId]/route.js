import { NextResponse } from "next/server";
import connectToDB from "@/lib/connectToDB";
import AudioFile from "@/models/AudioFile";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request, { params }) {
  const { userId } = await auth();

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

  await connectToDB();

  try {
    const audioId = await params.audioId;

    if (!audioId) {
      return NextResponse.json(
        { success: false, message: "Audio ID is required" },
        { status: 400 }
      );
    }

    const decodedAudioId = decodeURIComponent(audioId);

    const audio = await AudioFile.findById(decodedAudioId);

    if (!audio) {
      return NextResponse.json(
        { success: false, message: "Audio not found" },
        { status: 404 }
      );
    }

    const deletedDubbedAudio = await cloudinary.uploader.destroy(
      audio?.dubbedAudioUrl?.public_id,
      {
        resource_type: "video",
      }
    );

    if (!deletedDubbedAudio || deletedDubbedAudio.result === "not found") {
      return NextResponse.json(
        { success: false, message: "Failed to delete audio file" },
        { status: 500 }
      );
    }

    const deletedAudio = await audio.deleteOne();

    if (!deletedAudio.deletedCount) {
      return NextResponse.json(
        { success: false, message: "Failed to delete audio" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Audio deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while deleting audio", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
