import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, FileAudio, FileText, Languages } from "lucide-react";

export default function AudioFormResponseShimmer() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 animate-pulse">
          Processing Your Request
        </h1>
        <Card className="w-full">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <Music className="mr-2 animate-bounce" />
              <div className="h-8 bg-white bg-opacity-20 rounded w-1/2 animate-pulse"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-6 space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <FileAudio className="w-5 h-5 mr-2" />
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </h3>
              <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </h3>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mt-2 animate-pulse"></div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Languages className="w-5 h-5 mr-2" />
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </h3>
              <div className="inline-block">
                <Badge variant="secondary" className="mb-2 animate-pulse">
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                </Badge>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mt-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mt-2 animate-pulse"></div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Music className="w-5 h-5 mr-2" />
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </h3>
              <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="mt-4">
                <h4 className="text-md font-medium mb-2 flex items-center">
                  <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </h4>
                <div className="flex space-x-4">
                  <Badge
                    variant="secondary"
                    className="text-sm py-1 px-2 animate-pulse"
                  >
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-sm py-1 px-2 animate-pulse"
                  >
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
