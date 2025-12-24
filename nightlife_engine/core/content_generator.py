"""Main content generation engine."""

from typing import Dict, Any, Optional
from ..models.content_request import ContentRequest, ContentType
from ..models.brand_profile import BrandProfile
from ..models.event_context import EventContext
from .style_engine import StyleEngine
from .example_learner import ExampleLearner
from ..formatters import (
    InstagramReelFormatter,
    InstagramPostFormatter,
    PromotionFormatter,
    FlyerFormatter
)


class ContentGenerator:
    """
    Main content generation engine for nightlife social media.

    This is the primary interface for generating ready-to-post content.
    """

    def __init__(self):
        """Initialize content generator."""
        self.example_learner = ExampleLearner()

    def add_example(self, content: str, content_type: str) -> None:
        """
        Add example content to learn from.

        Args:
            content: The example content text
            content_type: Type of content (Instagram Reel, Instagram Post, etc.)
        """
        self.example_learner.add_example(content, content_type)

    def generate(self, request: ContentRequest) -> str:
        """
        Generate content based on the request.

        Args:
            request: ContentRequest with all necessary information

        Returns:
            Formatted, ready-to-post content string

        Raises:
            ValueError: If request is invalid or incomplete
        """
        # Initialize style engine
        style_engine = StyleEngine(request.brand_profile)

        # Get example guidance if available
        example_guidance = None
        if request.example_content:
            self.example_learner.add_example(
                request.example_content,
                request.content_type.value
            )
        example_guidance = self.example_learner.get_style_guidance(
            request.content_type.value
        )

        # Generate content based on type
        generated_content = self._generate_content_parts(
            request,
            style_engine,
            example_guidance
        )

        # Format output
        formatter = self._get_formatter(request)
        formatted_content = formatter.format(generated_content)

        return formatted_content

    def _generate_content_parts(
        self,
        request: ContentRequest,
        style_engine: StyleEngine,
        example_guidance: Optional[str]
    ) -> Dict[str, Any]:
        """
        Generate the individual parts of content.

        This method contains the core generation logic using the style guide
        and example patterns.
        """
        content_type = request.content_type

        if content_type == ContentType.INSTAGRAM_REEL:
            return self._generate_instagram_reel(request, style_engine, example_guidance)
        elif content_type == ContentType.INSTAGRAM_POST:
            return self._generate_instagram_post(request, style_engine, example_guidance)
        elif content_type == ContentType.PROMOTION:
            return self._generate_promotion(request, style_engine, example_guidance)
        elif content_type == ContentType.FLYER:
            return self._generate_flyer(request, style_engine, example_guidance)
        else:
            raise ValueError(f"Unsupported content type: {content_type}")

    def _generate_instagram_reel(
        self,
        request: ContentRequest,
        style_engine: StyleEngine,
        example_guidance: Optional[str]
    ) -> Dict[str, Any]:
        """Generate Instagram Reel content parts."""
        # This is a template-based generator
        # In a production system, this would integrate with an LLM
        # For now, we'll create structured templates

        event = request.event_context
        brand = request.brand_profile

        # Generate hook (max 8 words)
        hook = self._create_hook(event, brand, style_engine)

        # Generate main caption (1-2 sentences)
        caption = self._create_caption(event, brand, style_engine, "reel")

        # Generate CTA
        cta = self._create_cta(event, brand, style_engine)

        # Generate hashtags (exactly 5)
        hashtags = self._create_hashtags(brand, style_engine, 5)

        return {
            "hook": hook,
            "caption": caption,
            "cta": cta,
            "hashtags": hashtags
        }

    def _generate_instagram_post(
        self,
        request: ContentRequest,
        style_engine: StyleEngine,
        example_guidance: Optional[str]
    ) -> Dict[str, Any]:
        """Generate Instagram Post content parts."""
        event = request.event_context
        brand = request.brand_profile

        # Generate caption (max 2 sentences)
        caption = self._create_caption(event, brand, style_engine, "post")

        # Generate CTA
        cta = self._create_cta(event, brand, style_engine)

        # Generate hashtags (exactly 5)
        hashtags = self._create_hashtags(brand, style_engine, 5)

        return {
            "caption": caption,
            "cta": cta,
            "hashtags": hashtags
        }

    def _generate_promotion(
        self,
        request: ContentRequest,
        style_engine: StyleEngine,
        example_guidance: Optional[str]
    ) -> Dict[str, Any]:
        """Generate Promotion content parts."""
        event = request.event_context
        brand = request.brand_profile

        # Generate headline
        headline = self._create_headline(event, brand, style_engine)

        # Generate promo copy (2-3 sentences)
        promo_copy = self._create_promo_copy(event, brand, style_engine)

        # Generate CTA
        cta = self._create_cta(event, brand, style_engine)

        return {
            "headline": headline,
            "promo_copy": promo_copy,
            "cta": cta
        }

    def _generate_flyer(
        self,
        request: ContentRequest,
        style_engine: StyleEngine,
        example_guidance: Optional[str]
    ) -> Dict[str, Any]:
        """Generate Flyer content parts."""
        event = request.event_context
        brand = request.brand_profile

        # Generate headline
        headline = self._create_headline(event, brand, style_engine)

        # Generate subheadline
        subheadline = self._create_subheadline(event, brand, style_engine)

        # Generate event details
        event_details = self._create_event_details(event, brand)

        return {
            "headline": headline,
            "subheadline": subheadline,
            "event_details": event_details
        }

    def _create_hook(
        self,
        event: EventContext,
        brand: BrandProfile,
        style_engine: StyleEngine
    ) -> str:
        """Create a hook caption (max 8 words)."""
        # Template-based hook generation
        if event and event.event_name:
            return f"{event.event_name} is live"
        return "Tonight hits different"

    def _create_caption(
        self,
        event: EventContext,
        brand: BrandProfile,
        style_engine: StyleEngine,
        format_type: str
    ) -> str:
        """Create main caption."""
        sentences = []

        if event and event.dj_performer:
            sentences.append(f"{event.dj_performer} on the decks.")

        if event and event.special_notes:
            sentences.append(event.special_notes)
        else:
            # Default caption based on brand energy
            from ..models.brand_profile import BrandEnergy
            if brand.brand_energy == BrandEnergy.HIGH_ENERGY_PARTY:
                sentences.append("Energy unmatched.")
            elif brand.brand_energy == BrandEnergy.SEXY_MOODY:
                sentences.append("The vibe speaks for itself.")
            elif brand.brand_energy == BrandEnergy.CHILL_UPSCALE:
                sentences.append("Elevated experiences, curated for you.")
            else:
                sentences.append("Where culture meets nightlife.")

        # Limit to 2 sentences for most formats
        return " ".join(sentences[:2])

    def _create_cta(
        self,
        event: EventContext,
        brand: BrandProfile,
        style_engine: StyleEngine
    ) -> str:
        """Create call-to-action line."""
        from ..models.brand_profile import CTAStyle

        cta_map = {
            CTAStyle.RSVP: "RSVP via link in bio.",
            CTAStyle.BOOK: "Book your table now.",
            CTAStyle.PULL_UP: "Pull up tonight.",
            CTAStyle.TONIGHT: "See you tonight.",
            CTAStyle.SOFT_INVITE: "Link in bio."
        }

        return cta_map.get(brand.cta_style, "Link in bio.")

    def _create_hashtags(
        self,
        brand: BrandProfile,
        style_engine: StyleEngine,
        count: int
    ) -> list:
        """Create hashtags based on brand focus."""
        hashtags = []

        # Base nightlife hashtags
        base_tags = ["#nightlife", "#nightout", "#weekend", "#latenight", "#vibes"]

        # Focus-specific hashtags
        from ..models.brand_profile import ContentFocus
        focus_tags = {
            ContentFocus.EVENTS_DJS: ["#livemusic", "#dj", "#event", "#party"],
            ContentFocus.DRINKS_MENU: ["#cocktails", "#drinks", "#bar", "#mixology"],
            ContentFocus.CROWD_ATMOSPHERE: ["#atmosphere", "#vibes", "#crowd", "#experience"],
            ContentFocus.PROMOTIONS: ["#deals", "#promo", "#special", "#offer"]
        }

        # Additional filler tags for padding
        filler_tags = ["#music", "#party", "#nightclub", "#bar", "#drinks", "#djs", "#live"]

        # Add base tags
        hashtags.extend(base_tags[:3])

        # Add focus-specific tags
        for focus in brand.content_focus:
            if focus in focus_tags:
                hashtags.extend(focus_tags[focus][:2])

        # Pad with additional tags if needed
        if len(hashtags) < count:
            # Add remaining base tags
            for tag in base_tags[3:]:
                if len(hashtags) >= count:
                    break
                if tag not in hashtags:
                    hashtags.append(tag)

        # Add filler tags if still not enough
        if len(hashtags) < count:
            for tag in filler_tags:
                if len(hashtags) >= count:
                    break
                if tag not in hashtags:
                    hashtags.append(tag)

        # Return exactly the requested count
        return hashtags[:count]

    def _create_headline(
        self,
        event: EventContext,
        brand: BrandProfile,
        style_engine: StyleEngine
    ) -> str:
        """Create headline for promotion or flyer."""
        if event and event.event_name:
            return event.event_name.upper()
        return "TONIGHT"

    def _create_subheadline(
        self,
        event: EventContext,
        brand: BrandProfile,
        style_engine: StyleEngine
    ) -> str:
        """Create subheadline for flyer."""
        if event and event.dj_performer:
            return f"Featuring {event.dj_performer}"
        return "An Elevated Experience"

    def _create_promo_copy(
        self,
        event: EventContext,
        brand: BrandProfile,
        style_engine: StyleEngine
    ) -> str:
        """Create promotional copy (2-3 sentences)."""
        sentences = []

        if event and event.event_name:
            sentences.append(f"{event.event_name} returns.")

        if event and event.dj_performer:
            sentences.append(f"{event.dj_performer} sets the tone.")
        else:
            sentences.append("The city's best-kept secret.")

        sentences.append("Limited availability.")

        return " ".join(sentences[:3])

    def _create_event_details(
        self,
        event: EventContext,
        brand: BrandProfile
    ) -> str:
        """Create structured event details for flyer."""
        details = []

        if event:
            if event.event_name:
                details.append(f"EVENT: {event.event_name}")

            if event.date:
                details.append(f"DATE: {event.format_date()}")

            if event.dj_performer:
                details.append(f"FEATURING: {event.dj_performer}")

            if event.special_notes:
                details.append(f"DETAILS: {event.special_notes}")

        if not details:
            details.append("EVENT DETAILS")
            details.append("See link in bio for full information")

        return "\n".join(details)

    def _get_formatter(self, request: ContentRequest):
        """Get the appropriate formatter for the content type."""
        formatter_map = {
            ContentType.INSTAGRAM_REEL: InstagramReelFormatter,
            ContentType.INSTAGRAM_POST: InstagramPostFormatter,
            ContentType.PROMOTION: PromotionFormatter,
            ContentType.FLYER: FlyerFormatter
        }

        formatter_class = formatter_map.get(request.content_type)
        if not formatter_class:
            raise ValueError(f"No formatter for {request.content_type}")

        return formatter_class(
            request.brand_profile,
            request.event_context
        )
