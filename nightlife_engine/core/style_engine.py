"""Style enforcement and tone matching engine."""

from typing import Dict, List, Optional
from ..models.brand_profile import BrandProfile, BrandEnergy, CTAStyle


class StyleEngine:
    """Handles style enforcement and tone matching based on brand profile."""

    def __init__(self, brand_profile: BrandProfile):
        """Initialize style engine with brand profile."""
        self.brand_profile = brand_profile

    def get_tone_instructions(self) -> str:
        """Get tone instructions based on brand energy."""
        tone_map = {
            BrandEnergy.HIGH_ENERGY_PARTY: (
                "Use short, punchy sentences. Create urgency. "
                "Keep it high-energy and exciting. No fluff."
            ),
            BrandEnergy.SEXY_MOODY: (
                "Be minimal and confident. Use atmospheric language. "
                "Less is more. Create intrigue without overselling."
            ),
            BrandEnergy.CHILL_UPSCALE: (
                "Maintain refined, restrained language. Use premium vocabulary. "
                "Be sophisticated but not pretentious. Quality over hype."
            ),
            BrandEnergy.CULTURAL_ARTISTIC: (
                "Be expressive and stylish. Show cultural awareness. "
                "Use creative language that resonates with art and culture."
            )
        }
        return tone_map.get(
            self.brand_profile.brand_energy,
            "Be confident and professional."
        )

    def get_cta_instructions(self) -> str:
        """Get CTA instructions based on CTA style."""
        cta_map = {
            CTAStyle.RSVP: "Use RSVP-focused language. Formal reservation tone.",
            CTAStyle.BOOK: "Direct booking language. Clear call to reserve.",
            CTAStyle.PULL_UP: "Casual 'pull up' or 'come through' language. Street-smart tone.",
            CTAStyle.TONIGHT: "Urgent 'tonight' focus. Immediate action.",
            CTAStyle.SOFT_INVITE: "Subtle invitation. No hard sell. Suggestive language."
        }
        return cta_map.get(
            self.brand_profile.cta_style,
            "Include appropriate call to action."
        )

    def get_sentence_style_rules(self) -> Dict[str, any]:
        """Get sentence structure rules based on brand energy."""
        style_rules = {
            BrandEnergy.HIGH_ENERGY_PARTY: {
                "max_sentence_length": 15,
                "prefer_fragments": True,
                "use_exclamation": True,
                "pace": "fast"
            },
            BrandEnergy.SEXY_MOODY: {
                "max_sentence_length": 12,
                "prefer_fragments": True,
                "use_exclamation": False,
                "pace": "slow"
            },
            BrandEnergy.CHILL_UPSCALE: {
                "max_sentence_length": 20,
                "prefer_fragments": False,
                "use_exclamation": False,
                "pace": "medium"
            },
            BrandEnergy.CULTURAL_ARTISTIC: {
                "max_sentence_length": 18,
                "prefer_fragments": False,
                "use_exclamation": False,
                "pace": "medium"
            }
        }
        return style_rules.get(self.brand_profile.brand_energy, {
            "max_sentence_length": 15,
            "prefer_fragments": False,
            "use_exclamation": False,
            "pace": "medium"
        })

    def get_hashtag_style(self) -> str:
        """Get hashtag selection guidance."""
        focus_areas = [f.value for f in self.brand_profile.content_focus]
        return (
            f"Select hashtags relevant to: {', '.join(focus_areas)}. "
            f"Match the {self.brand_profile.posting_vibe.value} vibe. "
            "Keep hashtags specific to nightlife and the brand's focus."
        )

    def should_use_emojis(self) -> bool:
        """Determine if emojis should be used based on posting vibe."""
        from ..models.brand_profile import PostingVibe
        # Generally avoid emojis unless vibe is loud & hype
        return self.brand_profile.posting_vibe == PostingVibe.LOUD_HYPE

    def get_forbidden_phrases(self) -> List[str]:
        """Get list of cliché phrases to avoid."""
        return [
            "don't miss out",
            "you won't want to miss",
            "epic night",
            "unforgettable experience",
            "one night only" if "one night only" not in [w.lower() for w in self.brand_profile.words_to_avoid] else "",
            "limited time",
            "exclusive opportunity",
            "vibe check",
            "it's lit",
            "turn up"
        ]

    def get_complete_style_guide(self) -> str:
        """Get complete style guide for content generation."""
        rules = self.get_sentence_style_rules()

        guide = f"""
TONE: {self.get_tone_instructions()}

SENTENCE STYLE:
- Maximum {rules['max_sentence_length']} words per sentence
- Pace: {rules['pace']}
- Fragments allowed: {rules['prefer_fragments']}
- Exclamation points: {rules['use_exclamation']}

CTA STYLE: {self.get_cta_instructions()}

HASHTAGS: {self.get_hashtag_style()}

EMOJIS: {"Allowed" if self.should_use_emojis() else "Not allowed"}

FORBIDDEN WORDS: {', '.join(self.brand_profile.words_to_avoid)}

AVOID CLICHÉS: Never use generic marketing phrases like "don't miss out", "epic night", etc.

TARGET AUDIENCE: {self.brand_profile.target_crowd.value}

BUSINESS TYPE: {self.brand_profile.business_type.value}
"""
        return guide.strip()
