"use client";

import { useState, useRef } from "react";
import { ContentGenerator } from "@/lib/core/content-generator";
import {
  BusinessType,
  BrandEnergy,
  TargetCrowd,
  ContentFocus,
  PostingVibe,
  CTAStyle,
  BrandProfile,
} from "@/lib/models/brand-profile";
import { ContentType, MediaType } from "@/lib/models/content-request";
import { EventContext } from "@/lib/models/event-context";

interface UploadedMedia {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

export default function Home() {
  // Brand Profile State
  const [businessType, setBusinessType] = useState<BusinessType>(
    BusinessType.LOUNGE
  );
  const [brandEnergy, setBrandEnergy] = useState<BrandEnergy>(
    BrandEnergy.CHILL_UPSCALE
  );
  const [targetCrowd, setTargetCrowd] = useState<TargetCrowd>(TargetCrowd.MID);
  const [contentFocus, setContentFocus] = useState<ContentFocus[]>([
    ContentFocus.EVENTS_DJS,
  ]);
  const [postingVibe, setPostingVibe] = useState<PostingVibe>(
    PostingVibe.CLEAN_MINIMAL
  );
  const [ctaStyle, setCTAStyle] = useState<CTAStyle>(CTAStyle.RSVP);
  const [wordsToAvoid, setWordsToAvoid] = useState<string>("");

  // Content Request State
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.INSTAGRAM_REEL
  );
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.PHOTO);

  // Event Context State
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [djPerformer, setDJPerformer] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  // Media Upload State
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Output State
  const [generatedContent, setGeneratedContent] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleContentFocusChange = (focus: ContentFocus) => {
    if (contentFocus.includes(focus)) {
      setContentFocus(contentFocus.filter((f) => f !== focus));
    } else if (contentFocus.length < 2) {
      setContentFocus([...contentFocus, focus]);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newMedia: UploadedMedia[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        return;
      }

      const mediaType = file.type.startsWith("image/") ? "image" : "video";
      const preview = URL.createObjectURL(file);

      newMedia.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        type: mediaType,
      });
    });

    setUploadedMedia((prev) => [...prev, ...newMedia]);

    // Auto-detect media type based on uploaded files
    if (newMedia.length > 0) {
      const hasVideo = newMedia.some((m) => m.type === "video");
      setMediaType(hasVideo ? MediaType.VIDEO : MediaType.PHOTO);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeMedia = (id: string) => {
    setUploadedMedia((prev) => {
      const media = prev.find((m) => m.id === id);
      if (media) {
        URL.revokeObjectURL(media.preview);
      }
      return prev.filter((m) => m.id !== id);
    });
  };

  const handleGenerate = () => {
    try {
      setError("");
      setCopied(false);

      // Build brand profile
      const brandProfile: BrandProfile = {
        businessType,
        brandEnergy,
        targetCrowd,
        contentFocus,
        postingVibe,
        ctaStyle,
        wordsToAvoid: wordsToAvoid
          .split(",")
          .map((w) => w.trim())
          .filter((w) => w),
      };

      // Build event context
      let eventContext: EventContext | undefined;
      if (eventName || eventDate || djPerformer || specialNotes) {
        eventContext = {
          eventName: eventName || undefined,
          date: eventDate ? new Date(eventDate) : undefined,
          djPerformer: djPerformer || undefined,
          specialNotes: specialNotes || undefined,
        };
      }

      // Generate content
      const generator = new ContentGenerator();
      const content = generator.generate({
        mediaType,
        mediaCount: uploadedMedia.length || 1,
        contentType,
        brandProfile,
        eventContext,
      });

      setGeneratedContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Frame Zero</h1>
          <p className="text-xl text-purple-200">
            Nightlife Social Content Engine
          </p>
          <p className="text-sm text-purple-300 mt-2">
            Upload your media and generate ready-to-post content
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Column */}
          <div className="space-y-6">
            {/* Media Upload Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Upload Media
              </h2>

              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-purple-400 bg-purple-500/20"
                    : "border-white/30 hover:border-purple-400 hover:bg-white/5"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />

                <svg
                  className="w-12 h-12 mx-auto mb-4 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>

                <p className="text-white font-medium mb-2">
                  Drop images or videos here
                </p>
                <p className="text-purple-300 text-sm">
                  or click to browse files
                </p>
              </div>

              {/* Uploaded Media Preview */}
              {uploadedMedia.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-purple-200">
                      {uploadedMedia.length} file
                      {uploadedMedia.length !== 1 ? "s" : ""} uploaded
                    </p>
                    <button
                      onClick={() => {
                        uploadedMedia.forEach((m) =>
                          URL.revokeObjectURL(m.preview)
                        );
                        setUploadedMedia([]);
                      }}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {uploadedMedia.map((media) => (
                      <div
                        key={media.id}
                        className="relative group rounded-lg overflow-hidden bg-black/30 aspect-square"
                      >
                        {media.type === "image" ? (
                          <img
                            src={media.preview}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={media.preview}
                            className="w-full h-full object-cover"
                            muted
                          />
                        )}

                        {/* Remove button */}
                        <button
                          onClick={() => removeMedia(media.id)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>

                        {/* Type indicator */}
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {media.type === "video" ? "📹" : "📷"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Brand Profile Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Brand Profile
              </h2>

              {/* Business Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Business Type
                </label>
                <select
                  value={businessType}
                  onChange={(e) =>
                    setBusinessType(e.target.value as BusinessType)
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.values(BusinessType).map((type) => (
                    <option key={type} value={type} className="bg-slate-900">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Energy */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Brand Energy
                </label>
                <select
                  value={brandEnergy}
                  onChange={(e) =>
                    setBrandEnergy(e.target.value as BrandEnergy)
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.values(BrandEnergy).map((energy) => (
                    <option
                      key={energy}
                      value={energy}
                      className="bg-slate-900"
                    >
                      {energy}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Crowd */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Target Crowd
                </label>
                <select
                  value={targetCrowd}
                  onChange={(e) =>
                    setTargetCrowd(e.target.value as TargetCrowd)
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.values(TargetCrowd).map((crowd) => (
                    <option key={crowd} value={crowd} className="bg-slate-900">
                      {crowd}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content Focus */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Content Focus (Max 2)
                </label>
                <div className="space-y-2">
                  {Object.values(ContentFocus).map((focus) => (
                    <label
                      key={focus}
                      className="flex items-center space-x-2 text-white cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={contentFocus.includes(focus)}
                        onChange={() => handleContentFocusChange(focus)}
                        disabled={
                          !contentFocus.includes(focus) &&
                          contentFocus.length >= 2
                        }
                        className="w-4 h-4 text-purple-600 border-white/20 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm">{focus}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Posting Vibe */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Posting Vibe
                </label>
                <select
                  value={postingVibe}
                  onChange={(e) =>
                    setPostingVibe(e.target.value as PostingVibe)
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.values(PostingVibe).map((vibe) => (
                    <option key={vibe} value={vibe} className="bg-slate-900">
                      {vibe}
                    </option>
                  ))}
                </select>
              </div>

              {/* CTA Style */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  CTA Style
                </label>
                <select
                  value={ctaStyle}
                  onChange={(e) => setCTAStyle(e.target.value as CTAStyle)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.values(CTAStyle).map((style) => (
                    <option key={style} value={style} className="bg-slate-900">
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              {/* Words to Avoid */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Words to Avoid (comma-separated)
                </label>
                <input
                  type="text"
                  value={wordsToAvoid}
                  onChange={(e) => setWordsToAvoid(e.target.value)}
                  placeholder="epic, unforgettable, exclusive"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Content Settings Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Content Settings
              </h2>

              {/* Content Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) =>
                    setContentType(e.target.value as ContentType)
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.values(ContentType).map((type) => (
                    <option key={type} value={type} className="bg-slate-900">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Media Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Media Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 text-white cursor-pointer">
                    <input
                      type="radio"
                      checked={mediaType === MediaType.PHOTO}
                      onChange={() => setMediaType(MediaType.PHOTO)}
                      className="w-4 h-4 text-purple-600 border-white/20 focus:ring-purple-500"
                    />
                    <span>Photo</span>
                  </label>
                  <label className="flex items-center space-x-2 text-white cursor-pointer">
                    <input
                      type="radio"
                      checked={mediaType === MediaType.VIDEO}
                      onChange={() => setMediaType(MediaType.VIDEO)}
                      className="w-4 h-4 text-purple-600 border-white/20 focus:ring-purple-500"
                    />
                    <span>Video</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Event Context Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Event Details (Optional)
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Late Night Sessions"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    DJ / Performer
                  </label>
                  <input
                    type="text"
                    value={djPerformer}
                    onChange={(e) => setDJPerformer(e.target.value)}
                    placeholder="DJ Shadow"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Special Notes
                  </label>
                  <textarea
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Special event details..."
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Generate Content
            </button>
          </div>

          {/* Output Column */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Generated Content
              </h2>

              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                  {error}
                </div>
              )}

              {generatedContent ? (
                <>
                  <div className="mb-4 p-6 bg-black/30 rounded-lg border border-white/10 min-h-[300px]">
                    <pre className="text-white whitespace-pre-wrap font-mono text-sm">
                      {generatedContent}
                    </pre>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-200"
                  >
                    {copied ? "✓ Copied!" : "Copy to Clipboard"}
                  </button>
                </>
              ) : (
                <div className="p-12 text-center text-purple-300">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>Your generated content will appear here</p>
                  <p className="text-sm mt-2 opacity-75">
                    Upload media, configure your settings, and click Generate
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-purple-300 text-sm">
          <p>Frame Zero - Nightlife Social Content Engine</p>
          <p className="mt-2 opacity-75">
            Built for nightlife businesses that demand quality content
          </p>
        </footer>
      </div>
    </div>
  );
}
