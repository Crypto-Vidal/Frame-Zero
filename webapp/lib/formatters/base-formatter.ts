/**
 * Base formatter for all content types
 */

import { BrandProfile } from "../models/brand-profile";
import { EventContext } from "../models/event-context";

export interface GeneratedContent {
  [key: string]: string | string[];
}

export abstract class BaseFormatter {
  constructor(
    protected brandProfile: BrandProfile,
    protected eventContext?: EventContext
  ) {}

  abstract format(generatedContent: GeneratedContent): string;

  protected cleanOutput(text: string): string {
    let cleaned = text;
    for (const word of this.brandProfile.wordsToAvoid) {
      const pattern = new RegExp(word, "gi");
      cleaned = cleaned.replace(pattern, "");
    }
    // Clean up extra whitespace
    cleaned = cleaned.split(/\s+/).join(" ");
    return cleaned.trim();
  }

  protected validateLength(text: string, maxWords: number, fieldName: string): void {
    const wordCount = text.split(/\s+/).length;
    if (wordCount > maxWords) {
      throw new Error(
        `${fieldName} exceeds maximum ${maxWords} words (got ${wordCount} words)`
      );
    }
  }
}
