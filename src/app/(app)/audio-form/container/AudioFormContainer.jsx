"use client";

import { useState } from "react";
import axios from "axios";
import AudioForm from "../presentation/AudioForm";
import { useToast } from "@/hooks/use-toast";

export default function AudioFormContainer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const { toast } = useToast();

  const onSubmit = async (data) => {
    // Handle form submission here

    // console.log("data", data);
    // return;

    setIsSubmitting(true);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", data.audioFile);
      formData.append("language", data.targetLanguage);

      const response = await axios.post("/api/audio/send-audio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.success) {
        setResponseData(response?.data?.audioFile);
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <AudioForm
      loading={loading}
      responseData={responseData}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      setResponseData={setResponseData}
    />
  );
}
