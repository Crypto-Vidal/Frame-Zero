"use client";

import { useState, useEffect } from "react";
import { BusinessProfile, BusinessProfileCreate } from "@/lib/models/business-profile";
import { BusinessStorage } from "@/lib/utils/business-storage";
import {
  BusinessType,
  BrandEnergy,
  TargetCrowd,
  ContentFocus,
  PostingVibe,
  CTAStyle,
  BrandProfile,
} from "@/lib/models/brand-profile";

interface ResourcesManagerProps {
  onClose: () => void;
  onSelectBusiness: (business: BusinessProfile) => void;
}

export default function ResourcesManager({
  onClose,
  onSelectBusiness,
}: ResourcesManagerProps) {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [businessName, setBusinessName] = useState("");
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

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = () => {
    const loaded = BusinessStorage.getAll();
    setBusinesses(loaded);
  };

  const handleContentFocusChange = (focus: ContentFocus) => {
    if (contentFocus.includes(focus)) {
      setContentFocus(contentFocus.filter((f) => f !== focus));
    } else if (contentFocus.length < 2) {
      setContentFocus([...contentFocus, focus]);
    }
  };

  const resetForm = () => {
    setBusinessName("");
    setBusinessType(BusinessType.LOUNGE);
    setBrandEnergy(BrandEnergy.CHILL_UPSCALE);
    setTargetCrowd(TargetCrowd.MID);
    setContentFocus([ContentFocus.EVENTS_DJS]);
    setPostingVibe(PostingVibe.CLEAN_MINIMAL);
    setCTAStyle(CTAStyle.RSVP);
    setWordsToAvoid("");
  };

  const loadBusinessToForm = (business: BusinessProfile) => {
    setBusinessName(business.businessName);
    setBusinessType(business.brandSettings.businessType);
    setBrandEnergy(business.brandSettings.brandEnergy);
    setTargetCrowd(business.brandSettings.targetCrowd);
    setContentFocus(business.brandSettings.contentFocus);
    setPostingVibe(business.brandSettings.postingVibe);
    setCTAStyle(business.brandSettings.ctaStyle);
    setWordsToAvoid(business.brandSettings.wordsToAvoid.join(", "));
  };

  const handleCreate = () => {
    if (!businessName.trim()) {
      alert("Please enter a business name");
      return;
    }

    const brandSettings: BrandProfile = {
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

    const data: BusinessProfileCreate = {
      businessName: businessName.trim(),
      brandSettings,
    };

    BusinessStorage.create(data);
    loadBusinesses();
    resetForm();
    setIsCreating(false);
  };

  const handleUpdate = () => {
    if (!editingId || !businessName.trim()) return;

    const brandSettings: BrandProfile = {
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

    BusinessStorage.update(editingId, {
      businessName: businessName.trim(),
      brandSettings,
    });

    loadBusinesses();
    resetForm();
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this business profile?")) {
      BusinessStorage.delete(id);
      loadBusinesses();
    }
  };

  const handleExport = () => {
    const data = BusinessStorage.exportAll();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `frame-zero-businesses-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      if (BusinessStorage.importAll(data)) {
        loadBusinesses();
        alert("Businesses imported successfully!");
      } else {
        alert("Failed to import businesses. Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleSelect = (business: BusinessProfile) => {
    onSelectBusiness(business);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Business Resources</h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsCreating(!isCreating);
                setEditingId(null);
                resetForm();
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              {isCreating ? "Cancel" : "+ New Business"}
            </button>

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/20"
            >
              Export All
            </button>

            <label className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/20 cursor-pointer">
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Create/Edit Form */}
          {(isCreating || editingId) && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingId ? "Edit Business" : "Create New Business"}
              </h3>

              <div className="space-y-4">
                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Velvet Lounge"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Business Type */}
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <div>
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
                <div>
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

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={editingId ? handleUpdate : handleCreate}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {editingId ? "Update" : "Create"} Business
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Business List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">
              My Businesses ({businesses.length})
            </h3>

            {businesses.length === 0 ? (
              <div className="bg-white/5 rounded-lg p-8 text-center text-purple-300">
                <p>No businesses yet. Create your first one!</p>
              </div>
            ) : (
              businesses.map((business) => (
                <div
                  key={business.id}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white">
                        {business.businessName}
                      </h4>
                      <p className="text-sm text-purple-300">
                        {business.brandSettings.businessType} •{" "}
                        {business.brandSettings.brandEnergy}
                      </p>
                      <p className="text-xs text-purple-400 mt-1">
                        {business.savedMedia.length} media files •{" "}
                        {business.exampleContent.length} examples
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSelect(business)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Use
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(business.id);
                          setIsCreating(false);
                          loadBusinessToForm(business);
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(business.id)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
