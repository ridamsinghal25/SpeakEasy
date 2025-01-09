export function extractTranscriptDetails(transcriptRaw) {
  const transcriptionMatch = transcriptRaw.match(
    /(?:^|\n)?(?:-\s*)?transcription:\s*(.*?)(?=\s*(?:-\s*)?translation:|\s*\n\s*(?:-\s*)?translation:)/is
  );

  // Match for both hyphenated and non-hyphenated formats, until audio or end
  const translationMatch = transcriptRaw.match(
    /(?:^|\n)?(?:-\s*)?translation:\s*(.*?)(?=\s*(?:-\s*)?audio:|\s*\n\s*(?:-\s*)?audio:|\s*$)/is
  );

  const transcription = (transcriptionMatch?.[1] || "").trim();
  const translation = (translationMatch?.[1] || "").trim();

  return {
    transcription,
    translation,
  };
}
