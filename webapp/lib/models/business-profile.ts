/**
 * Business Profile types and interfaces
 */

import { BrandProfile } from "./brand-profile";

export interface SavedMedia {
  id: string;
  name: string;
  dataUrl: string; // base64 encoded image/video
  type: "image" | "video";
  uploadedAt: Date;
}

export interface ExampleContent {
  id: string;
  type: "Instagram Reel" | "Instagram Post" | "Promotion" | "Flyer";
  content: string;
  createdAt: Date;
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  logo?: string; // base64 encoded logo
  brandSettings: BrandProfile;
  savedMedia: SavedMedia[];
  exampleContent: ExampleContent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessProfileCreate {
  businessName: string;
  logo?: string;
  brandSettings: BrandProfile;
}
