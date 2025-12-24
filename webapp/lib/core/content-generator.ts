/**
 * Main content generation engine
 */

import { ContentRequest, ContentType } from "../models/content-request";
import { BrandProfile, CTAStyle, ContentFocus } from "../models/brand-profile";
import { EventContext, formatDate } from "../models/event-context";
import { StyleEngine } from "./style-engine";
import { GeneratedContent } from "../formatters/base-formatter";
import { InstagramReelFormatter } from "../formatters/instagram-reel-formatter";
import { InstagramPostFormatter } from "../formatters/instagram-post-formatter";
import { PromotionFormatter } from "../formatters/promotion-formatter";
import { FlyerFormatter } from "../formatters/flyer-formatter";

export class ContentGenerator {
  generate(request: ContentRequest): string {
    const styleEngine = new StyleEngine(request.brandProfile);
    const generatedContent = this.generateContentParts(request, styleEngine);
    const formatter = this.getFormatter(request);
    return formatter.format(generatedContent);
  }

  private generateContentParts(
    request: ContentRequest,
    styleEngine: StyleEngine
  ): GeneratedContent {
    switch (request.contentType) {
      case ContentType.INSTAGRAM_REEL:
        return this.generateInstagramReel(request, styleEngine);
      case ContentType.INSTAGRAM_POST:
        return this.generateInstagramPost(request, styleEngine);
      case ContentType.PROMOTION:
        return this.generatePromotion(request, styleEngine);
      case ContentType.FLYER:
        return this.generateFlyer(request, styleEngine);
      default:
        throw new Error(`Unsupported content type: ${request.contentType}`);
    }
  }

  private generateInstagramReel(
    request: ContentRequest,
    styleEngine: StyleEngine
  ): GeneratedContent {
    const event = request.eventContext;
    const brand = request.brandProfile;

    return {
      hook: this.createHook(event, brand),
      caption: this.createCaption(event, brand, "reel"),
      cta: this.createCTA(event, brand),
      hashtags: this.createHashtags(brand, 5),
    };
  }

  private generateInstagramPost(
    request: ContentRequest,
    styleEngine: StyleEngine
  ): GeneratedContent {
    const event = request.eventContext;
    const brand = request.brandProfile;

    return {
      caption: this.createCaption(event, brand, "post"),
      cta: this.createCTA(event, brand),
      hashtags: this.createHashtags(brand, 5),
    };
  }

  private generatePromotion(
    request: ContentRequest,
    styleEngine: StyleEngine
  ): GeneratedContent {
    const event = request.eventContext;
    const brand = request.brandProfile;

    return {
      headline: this.createHeadline(event, brand),
      promoCopy: this.createPromoCopy(event, brand),
      cta: this.createCTA(event, brand),
    };
  }

  private generateFlyer(
    request: ContentRequest,
    styleEngine: StyleEngine
  ): GeneratedContent {
    const event = request.eventContext;
    const brand = request.brandProfile;

    return {
      headline: this.createHeadline(event, brand),
      subheadline: this.createSubheadline(event, brand),
      eventDetails: this.createEventDetails(event, brand),
    };
  }

  private createHook(event?: EventContext, brand?: BrandProfile): string {
    if (event?.eventName) {
      return `${event.eventName} is live`;
    }
    return "Tonight hits different";
  }

  private createCaption(
    event?: EventContext,
    brand?: BrandProfile,
    formatType: string = "post"
  ): string {
    const sentences: string[] = [];

    if (event?.djPerformer) {
      sentences.push(`${event.djPerformer} on the decks.`);
    }

    if (event?.specialNotes) {
      sentences.push(event.specialNotes);
    } else if (brand) {
      // Default caption based on brand energy
      const energyMap: Record<string, string> = {
        "high-energy party": "Energy unmatched.",
        "sexy & moody": "The vibe speaks for itself.",
        "chill & upscale": "Elevated experiences, curated for you.",
        "cultural & artistic": "Where culture meets nightlife.",
      };
      sentences.push(energyMap[brand.brandEnergy] || "Where culture meets nightlife.");
    }

    return sentences.slice(0, 2).join(" ");
  }

  private createCTA(event?: EventContext, brand?: BrandProfile): string {
    if (!brand) return "Link in bio.";

    const ctaMap: Record<CTAStyle, string> = {
      [CTAStyle.RSVP]: "RSVP via link in bio.",
      [CTAStyle.BOOK]: "Book your table now.",
      [CTAStyle.PULL_UP]: "Pull up tonight.",
      [CTAStyle.TONIGHT]: "See you tonight.",
      [CTAStyle.SOFT_INVITE]: "Link in bio.",
    };

    return ctaMap[brand.ctaStyle] || "Link in bio.";
  }

  private createHashtags(brand: BrandProfile, count: number): string[] {
    const hashtags: string[] = [];

    // Base nightlife hashtags
    const baseTags = [
      "#nightlife",
      "#nightout",
      "#weekend",
      "#latenight",
      "#vibes",
    ];

    // Focus-specific hashtags
    const focusTags: Record<ContentFocus, string[]> = {
      [ContentFocus.EVENTS_DJS]: ["#livemusic", "#dj", "#event", "#party"],
      [ContentFocus.DRINKS_MENU]: ["#cocktails", "#drinks", "#bar", "#mixology"],
      [ContentFocus.CROWD_ATMOSPHERE]: [
        "#atmosphere",
        "#vibes",
        "#crowd",
        "#experience",
      ],
      [ContentFocus.PROMOTIONS]: ["#deals", "#promo", "#special", "#offer"],
    };

    // Additional filler tags
    const fillerTags = [
      "#music",
      "#party",
      "#nightclub",
      "#bar",
      "#drinks",
      "#djs",
      "#live",
    ];

    // Add base tags
    hashtags.push(...baseTags.slice(0, 3));

    // Add focus-specific tags
    for (const focus of brand.contentFocus) {
      if (focusTags[focus]) {
        hashtags.push(...focusTags[focus].slice(0, 2));
      }
    }

    // Pad with remaining base tags if needed
    if (hashtags.length < count) {
      for (const tag of baseTags.slice(3)) {
        if (hashtags.length >= count) break;
        if (!hashtags.includes(tag)) {
          hashtags.push(tag);
        }
      }
    }

    // Add filler tags if still not enough
    if (hashtags.length < count) {
      for (const tag of fillerTags) {
        if (hashtags.length >= count) break;
        if (!hashtags.includes(tag)) {
          hashtags.push(tag);
        }
      }
    }

    return hashtags.slice(0, count);
  }

  private createHeadline(event?: EventContext, brand?: BrandProfile): string {
    if (event?.eventName) {
      return event.eventName.toUpperCase();
    }
    return "TONIGHT";
  }

  private createSubheadline(event?: EventContext, brand?: BrandProfile): string {
    if (event?.djPerformer) {
      return `Featuring ${event.djPerformer}`;
    }
    return "An Elevated Experience";
  }

  private createPromoCopy(event?: EventContext, brand?: BrandProfile): string {
    const sentences: string[] = [];

    if (event?.eventName) {
      sentences.push(`${event.eventName} returns.`);
    }

    if (event?.djPerformer) {
      sentences.push(`${event.djPerformer} sets the tone.`);
    } else {
      sentences.push("The city's best-kept secret.");
    }

    sentences.push("Limited availability.");

    return sentences.slice(0, 3).join(" ");
  }

  private createEventDetails(event?: EventContext, brand?: BrandProfile): string {
    const details: string[] = [];

    if (event) {
      if (event.eventName) {
        details.push(`EVENT: ${event.eventName}`);
      }

      if (event.date) {
        details.push(`DATE: ${formatDate(event.date)}`);
      }

      if (event.djPerformer) {
        details.push(`FEATURING: ${event.djPerformer}`);
      }

      if (event.specialNotes) {
        details.push(`DETAILS: ${event.specialNotes}`);
      }
    }

    if (details.length === 0) {
      details.push("EVENT DETAILS");
      details.push("See link in bio for full information");
    }

    return details.join("\n");
  }

  private getFormatter(request: ContentRequest) {
    const { brandProfile, eventContext } = request;

    switch (request.contentType) {
      case ContentType.INSTAGRAM_REEL:
        return new InstagramReelFormatter(brandProfile, eventContext);
      case ContentType.INSTAGRAM_POST:
        return new InstagramPostFormatter(brandProfile, eventContext);
      case ContentType.PROMOTION:
        return new PromotionFormatter(brandProfile, eventContext);
      case ContentType.FLYER:
        return new FlyerFormatter(brandProfile, eventContext);
      default:
        throw new Error(`No formatter for ${request.contentType}`);
    }
  }
}
