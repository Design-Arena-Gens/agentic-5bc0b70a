"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Video, Download, Loader2, Film } from "lucide-react";

interface GeneratedVideo {
  id: string;
  prompt: string;
  url: string;
  status: "generating" | "completed" | "failed";
  progress: number;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const newVideo: GeneratedVideo = {
      id: Date.now().toString(),
      prompt: prompt,
      url: "",
      status: "generating",
      progress: 0,
    };

    setVideos([newVideo, ...videos]);
    setIsGenerating(true);
    setPrompt("");

    // Simulate video generation with progress
    const videoIndex = 0;
    const progressInterval = setInterval(() => {
      setVideos((prev) => {
        const updated = [...prev];
        if (updated[videoIndex].progress < 90) {
          updated[videoIndex].progress += Math.random() * 15;
        }
        return updated;
      });
    }, 1000);

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newVideo.prompt }),
      });

      clearInterval(progressInterval);

      if (response.ok) {
        const data = await response.json();
        setVideos((prev) => {
          const updated = [...prev];
          updated[videoIndex] = {
            ...updated[videoIndex],
            status: "completed",
            url: data.videoUrl,
            progress: 100,
          };
          return updated;
        });
      } else {
        setVideos((prev) => {
          const updated = [...prev];
          updated[videoIndex].status = "failed";
          return updated;
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      setVideos((prev) => {
        const updated = [...prev];
        updated[videoIndex].status = "failed";
        return updated;
      });
    }

    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="flex items-center justify-center gap-3">
            <Film className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Video Generator
            </h1>
          </div>
          <p className="text-center text-gray-400 mt-2">
            Powered by Google Veo 3.1 | 8K Ultra Realistic Cinematic Videos
          </p>
        </motion.header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl"
          >
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">
                  Describe Your Vision
                </h2>
                <p className="text-gray-400 text-sm">
                  Enter a detailed prompt to generate stunning 8K cinematic video
                </p>
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A majestic eagle soaring through snow-capped mountains at golden hour, cinematic shot with dramatic lighting and clouds, ultra realistic 8K..."
              className="w-full h-32 bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              disabled={isGenerating}
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Generate 8K Video
                </>
              )}
            </button>
          </motion.div>

          {/* Generated Videos Grid */}
          {videos.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Video className="w-6 h-6 text-purple-400" />
                Generated Videos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900/50 backdrop-blur-xl rounded-xl overflow-hidden border border-purple-500/20 shadow-xl"
                  >
                    {/* Video Preview */}
                    <div className="aspect-video bg-gray-800 relative">
                      {video.status === "generating" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                          <div className="w-3/4 bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                              style={{ width: `${video.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-gray-400 text-sm mt-2">
                            {Math.round(video.progress)}% Complete
                          </p>
                        </div>
                      )}

                      {video.status === "completed" && video.url && (
                        <video
                          src={video.url}
                          controls
                          className="w-full h-full object-cover"
                          poster="/api/placeholder/800/450"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}

                      {video.status === "failed" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-red-400">Generation Failed</p>
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {video.prompt}
                      </p>

                      {video.status === "completed" && (
                        <button className="w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-300 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Download 8K Video
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Features */}
          {videos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: "🎬",
                  title: "8K Resolution",
                  description: "Ultra-high definition cinematic quality",
                },
                {
                  icon: "✨",
                  title: "Photorealistic",
                  description: "AI-powered realistic rendering",
                },
                {
                  icon: "⚡",
                  title: "Fast Generation",
                  description: "Create videos in minutes",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-6 border border-purple-500/10 text-center"
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>Powered by Google Veo 3.1 AI Video Generation Technology</p>
        </footer>
      </div>
    </div>
  );
}
