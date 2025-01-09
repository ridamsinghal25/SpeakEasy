// MongoDB database name
export const DB_NAME = "audio-dubbing";

// OpenAI API URL
export const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Routes
export const ROUTES = {
  HOME: "/",
  AUDIO_FORM: "/audio-form",
  MY_AUDIOS: "/my-audios",
};

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "hi", label: "Hindi" },
];
