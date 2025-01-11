"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, FileAudio, FileText, Languages } from "lucide-react";
import { LANGUAGES } from "@/constants";

export default function AudioFormResponse({ data }) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Audio Processing Result
        </h1>
        <Card className="w-full">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <Music className="mr-2" />
              Audio Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-6 space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <FileAudio className="w-5 h-5 mr-2" />
                Source Audio
              </h3>
              <audio
                src={data?.sourceAudioUrl?.url}
                controls
                className="w-full mb-4"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Transcription
              </h3>
              <p className="text-sm text-gray-700">{data?.transcription}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Languages className="w-5 h-5 mr-2" />
                Translation
              </h3>
              <Badge variant="secondary" className="mb-2">
                {LANGUAGES?.find((lang) => lang === data?.language)?.label}
              </Badge>
              <p className="text-sm text-gray-700">{data?.translation}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Music className="w-5 h-5 mr-2" />
                Translated Audio
              </h3>
              <audio
                src={data?.dubbedAudioUrl?.url}
                controls
                className="w-full mb-4"
              />
              {Boolean(data?.benchmark?.bleu) && (
                <div className="mt-4">
                  <h4 className="text-md font-medium mb-2">Benchmark Scores</h4>
                  <div className="flex space-x-4">
                    <Badge variant="secondary" className="text-sm py-1 px-2">
                      BLEU: {data.benchmark.bleu}
                    </Badge>
                    <Badge variant="secondary" className="text-sm py-1 px-2">
                      ROUGE: {data.benchmark.rouge}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
