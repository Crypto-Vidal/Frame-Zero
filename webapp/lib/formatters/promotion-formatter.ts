/**
 * Promotion content formatter
 */

import { BaseFormatter, GeneratedContent } from "./base-formatter";

export class PromotionFormatter extends BaseFormatter {
  format(generatedContent: GeneratedContent): string {
    const headline = generatedContent.headline as string || "";
    const promoCopy = generatedContent.promoCopy as string || "";
    const cta = generatedContent.cta as string || "";

    // Clean all parts
    const cleanedHeadline = this.cleanOutput(headline);
    const cleanedPromoCopy = this.cleanOutput(promoCopy);
    const cleanedCta = this.cleanOutput(cta);

    // Validate promo copy is 2-3 sentences
    const sentenceCount =
      (cleanedPromoCopy.match(/[.!?]/g) || []).length;
    if (sentenceCount < 2 || sentenceCount > 3) {
      throw new Error(
        `Promo copy must be 2-3 sentences (got ${sentenceCount})`
      );
    }

    // Format output
    return [cleanedHeadline, "", cleanedPromoCopy, "", cleanedCta].join("\n");
  }
}
