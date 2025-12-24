/**
 * Content request types
 */

import { BrandProfile } from "./brand-profile";
import { EventContext } from "./event-context";

export enum MediaType {
  PHOTO = "photo",
  VIDEO = "video",
}

export enum ContentType {
  INSTAGRAM_REEL = "Instagram Reel",
  INSTAGRAM_POST = "Instagram Post",
  PROMOTION = "Promotion",
  FLYER = "Flyer",
}

export interface ContentRequest {
  mediaType: MediaType;
  mediaCount: number;
  contentType: ContentType;
  brandProfile: BrandProfile;
  eventContext?: EventContext;
  mediaPaths?: string[];
  exampleContent?: string;
}

export function validateContentRequest(request: ContentRequest): void {
  if (request.mediaCount < 1) {
    throw new Error("Media count must be at least 1");
  }
  if (request.mediaPaths && request.mediaPaths.length !== request.mediaCount) {
    throw new Error("Media paths count must match media_count");
  }
}
