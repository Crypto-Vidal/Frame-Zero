/**
 * Style enforcement and tone matching engine
 */

import {
  BrandProfile,
  BrandEnergy,
  CTAStyle,
  ContentFocus,
  PostingVibe,
} from "../models/brand-profile";

export interface SentenceStyleRules {
  maxSentenceLength: number;
  preferFragments: boolean;
  useExclamation: boolean;
  pace: "fast" | "medium" | "slow";
}

export class StyleEngine {
  constructor(private brandProfile: BrandProfile) {}

  getToneInstructions(): string {
    const toneMap: Record<BrandEnergy, string> = {
      [BrandEnergy.HIGH_ENERGY_PARTY]:
        "Use short, punchy sentences. Create urgency. Keep it high-energy and exciting. No fluff.",
      [BrandEnergy.SEXY_MOODY]:
        "Be minimal and confident. Use atmospheric language. Less is more. Create intrigue without overselling.",
      [BrandEnergy.CHILL_UPSCALE]:
        "Maintain refined, restrained language. Use premium vocabulary. Be sophisticated but not pretentious. Quality over hype.",
      [BrandEnergy.CULTURAL_ARTISTIC]:
        "Be expressive and stylish. Show cultural awareness. Use creative language that resonates with art and culture.",
    };
    return toneMap[this.brandProfile.brandEnergy] || "Be confident and professional.";
  }

  getCTAInstructions(): string {
    const ctaMap: Record<CTAStyle, string> = {
      [CTAStyle.RSVP]: "Use RSVP-focused language. Formal reservation tone.",
      [CTAStyle.BOOK]: "Direct booking language. Clear call to reserve.",
      [CTAStyle.PULL_UP]: "Casual 'pull up' or 'come through' language. Street-smart tone.",
      [CTAStyle.TONIGHT]: "Urgent 'tonight' focus. Immediate action.",
      [CTAStyle.SOFT_INVITE]: "Subtle invitation. No hard sell. Suggestive language.",
    };
    return ctaMap[this.brandProfile.ctaStyle] || "Include appropriate call to action.";
  }

  getSentenceStyleRules(): SentenceStyleRules {
    const styleRules: Record<BrandEnergy, SentenceStyleRules> = {
      [BrandEnergy.HIGH_ENERGY_PARTY]: {
        maxSentenceLength: 15,
        preferFragments: true,
        useExclamation: true,
        pace: "fast",
      },
      [BrandEnergy.SEXY_MOODY]: {
        maxSentenceLength: 12,
        preferFragments: true,
        useExclamation: false,
        pace: "slow",
      },
      [BrandEnergy.CHILL_UPSCALE]: {
        maxSentenceLength: 20,
        preferFragments: false,
        useExclamation: false,
        pace: "medium",
      },
      [BrandEnergy.CULTURAL_ARTISTIC]: {
        maxSentenceLength: 18,
        preferFragments: false,
        useExclamation: false,
        pace: "medium",
      },
    };
    return (
      styleRules[this.brandProfile.brandEnergy] || {
        maxSentenceLength: 15,
        preferFragments: false,
        useExclamation: false,
        pace: "medium",
      }
    );
  }

  getHashtagStyle(): string {
    const focusAreas = this.brandProfile.contentFocus.map((f) => f.toString());
    return `Select hashtags relevant to: ${focusAreas.join(", ")}. Match the ${
      this.brandProfile.postingVibe
    } vibe. Keep hashtags specific to nightlife and the brand's focus.`;
  }

  shouldUseEmojis(): boolean {
    return this.brandProfile.postingVibe === PostingVibe.LOUD_HYPE;
  }

  getCompleteStyleGuide(): string {
    const rules = this.getSentenceStyleRules();
    return `
TONE: ${this.getToneInstructions()}

SENTENCE STYLE:
- Maximum ${rules.maxSentenceLength} words per sentence
- Pace: ${rules.pace}
- Fragments allowed: ${rules.preferFragments}
- Exclamation points: ${rules.useExclamation}

CTA STYLE: ${this.getCTAInstructions()}

HASHTAGS: ${this.getHashtagStyle()}

EMOJIS: ${this.shouldUseEmojis() ? "Allowed" : "Not allowed"}

FORBIDDEN WORDS: ${this.brandProfile.wordsToAvoid.join(", ")}

AVOID CLICHÉS: Never use generic marketing phrases like "don't miss out", "epic night", etc.

TARGET AUDIENCE: ${this.brandProfile.targetCrowd}

BUSINESS TYPE: ${this.brandProfile.businessType}
    `.trim();
  }
}
