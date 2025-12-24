/**
 * Flyer content formatter
 */

import { BaseFormatter, GeneratedContent } from "./base-formatter";

export class FlyerFormatter extends BaseFormatter {
  format(generatedContent: GeneratedContent): string {
    const headline = generatedContent.headline as string || "";
    const subheadline = generatedContent.subheadline as string || "";
    const eventDetails = generatedContent.eventDetails as string || "";

    // Clean headline and subheadline
    const cleanedHeadline = this.cleanOutput(headline);
    const cleanedSubheadline = this.cleanOutput(subheadline);

    // Clean event_details but preserve newlines
    const cleanedEventDetails = this.cleanMultiline(eventDetails);

    // Format output
    return [cleanedHeadline, cleanedSubheadline, "", cleanedEventDetails].join(
      "\n"
    );
  }

  private cleanMultiline(text: string): string {
    const lines = text.split("\n");
    const cleanedLines: string[] = [];

    for (const line of lines) {
      let cleaned = line;
      for (const word of this.brandProfile.wordsToAvoid) {
        const pattern = new RegExp(word, "gi");
        cleaned = cleaned.replace(pattern, "");
      }
      // Clean extra whitespace within the line
      cleaned = cleaned.split(/\s+/).join(" ").trim();
      if (cleaned) {
        cleanedLines.push(cleaned);
      }
    }

    return cleanedLines.join("\n");
  }
}
