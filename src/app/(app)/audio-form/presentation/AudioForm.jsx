"use client";

import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Music } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AudioFormResponseShimmer from "@/components/AudioFormResponseShimmer";
import AudioFormResponse from "@/components/AudioFormResponse";
import { LANGUAGES } from "@/constants";
import NextFileUploader from "@/components/NextFileUploader";

export default function AudioForm({
  loading,
  responseData,
  isSubmitting,
  onSubmit,
  setResponseData,
}) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  return loading ? (
    <AudioFormResponseShimmer />
  ) : responseData ? (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-gray-200 transition-colors"
            onClick={() => setResponseData(null)}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          {/* You can add additional actions or information here */}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <AudioFormResponse data={responseData} />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Music className="mr-2" />
            Audio Language Form
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="audio-file" className="text-lg font-semibold">
                Audio File
              </Label>
              <Controller
                name="audioFile"
                control={control}
                rules={{ required: "Audio file is required" }}
                render={({ field }) => (
                  <NextFileUploader
                    onUploadComplete={(info) => {
                      setValue("audioFile", info.file);
                      field.onChange(info.file);
                    }}
                  />
                )}
              />
              {errors.audioFile && (
                <p className="text-red-500">{errors.audioFile.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetLanguage" className="text-lg font-semibold">
                Target Language
              </Label>
              <Controller
                name="targetLanguage"
                control={control}
                rules={{ required: "Target Language is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="targetLanguage">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.targetLanguage && (
                <p className="text-red-500">{errors.targetLanguage.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-200 ease-in-out"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
