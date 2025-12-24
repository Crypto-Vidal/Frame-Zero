/**
 * Brand profile types and models
 */

export enum BusinessType {
  LOUNGE = "lounge",
  BAR = "bar",
  CLUB = "club",
  RESTAURANT_NIGHTLIFE = "restaurant + nightlife",
}

export enum BrandEnergy {
  CHILL_UPSCALE = "chill & upscale",
  HIGH_ENERGY_PARTY = "high-energy party",
  SEXY_MOODY = "sexy & moody",
  CULTURAL_ARTISTIC = "cultural & artistic",
}

export enum TargetCrowd {
  YOUNG = "21–25",
  MID = "25–30",
  MATURE = "30+",
  MIXED = "mixed",
}

export enum ContentFocus {
  EVENTS_DJS = "events & DJs",
  DRINKS_MENU = "drinks & menu",
  CROWD_ATMOSPHERE = "crowd & atmosphere",
  PROMOTIONS = "promotions",
}

export enum PostingVibe {
  CLEAN_MINIMAL = "clean & minimal",
  LOUD_HYPE = "loud & hype",
  SMOOTH_SEDUCTIVE = "smooth & seductive",
}

export enum CTAStyle {
  RSVP = "RSVP",
  BOOK = "book",
  PULL_UP = "pull-up",
  TONIGHT = "tonight",
  SOFT_INVITE = "soft invite",
}

export interface BrandProfile {
  businessType: BusinessType;
  brandEnergy: BrandEnergy;
  targetCrowd: TargetCrowd;
  contentFocus: ContentFocus[];
  postingVibe: PostingVibe;
  ctaStyle: CTAStyle;
  wordsToAvoid: string[];
}

export function getToneDescriptor(energy: BrandEnergy): string {
  const toneMap: Record<BrandEnergy, string> = {
    [BrandEnergy.HIGH_ENERGY_PARTY]: "short, punchy, urgent",
    [BrandEnergy.SEXY_MOODY]: "minimal, confident, atmospheric",
    [BrandEnergy.CHILL_UPSCALE]: "refined, restrained, premium",
    [BrandEnergy.CULTURAL_ARTISTIC]: "expressive, stylish, culturally aware",
  };
  return toneMap[energy] || "confident, professional";
}

export function validateBrandProfile(profile: BrandProfile): void {
  if (profile.contentFocus.length === 0) {
    throw new Error("Content focus must have at least 1 item");
  }
  if (profile.contentFocus.length > 2) {
    throw new Error("Content focus must have maximum 2 items");
  }
}
