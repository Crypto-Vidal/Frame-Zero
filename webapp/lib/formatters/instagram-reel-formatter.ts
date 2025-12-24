/**
 * Instagram Reel content formatter
 */

import { BaseFormatter, GeneratedContent } from "./base-formatter";

export class InstagramReelFormatter extends BaseFormatter {
  format(generatedContent: GeneratedContent): string {
    const hook = generatedContent.hook as string || "";
    const caption = generatedContent.caption as string || "";
    const cta = generatedContent.cta as string || "";
    const hashtags = generatedContent.hashtags as string[] || [];

    // Validate hook length
    this.validateLength(hook, 8, "Hook caption");

    // Ensure exactly 5 hashtags
    if (hashtags.length !== 5) {
      throw new Error(`Must have exactly 5 hashtags (got ${hashtags.length})`);
    }

    // Clean all parts
    const cleanedHook = this.cleanOutput(hook);
    const cleanedCaption = this.cleanOutput(caption);
    const cleanedCta = this.cleanOutput(cta);
    const cleanedHashtags = hashtags.map((tag) => this.cleanOutput(tag));

    // Format output
    return [
      cleanedHook,
      "",
      cleanedCaption,
      "",
      cleanedCta,
      "",
      cleanedHashtags.join(" "),
    ].join("\n");
  }
}
