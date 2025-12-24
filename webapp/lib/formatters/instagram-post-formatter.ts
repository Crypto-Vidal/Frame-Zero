/**
 * Instagram Post content formatter
 */

import { BaseFormatter, GeneratedContent } from "./base-formatter";

export class InstagramPostFormatter extends BaseFormatter {
  format(generatedContent: GeneratedContent): string {
    const caption = generatedContent.caption as string || "";
    const cta = generatedContent.cta as string || "";
    const hashtags = generatedContent.hashtags as string[] || [];

    // Ensure exactly 5 hashtags
    if (hashtags.length !== 5) {
      throw new Error(`Must have exactly 5 hashtags (got ${hashtags.length})`);
    }

    // Clean all parts
    const cleanedCaption = this.cleanOutput(caption);
    const cleanedCta = this.cleanOutput(cta);
    const cleanedHashtags = hashtags.map((tag) => this.cleanOutput(tag));

    // Validate caption is max 2 sentences
    const sentenceCount =
      (cleanedCaption.match(/[.!?]/g) || []).length;
    if (sentenceCount > 2) {
      throw new Error(
        `Caption must be max 2 sentences (got ${sentenceCount})`
      );
    }

    // Format output
    return [
      cleanedCaption,
      "",
      cleanedCta,
      "",
      cleanedHashtags.join(" "),
    ].join("\n");
  }
}
