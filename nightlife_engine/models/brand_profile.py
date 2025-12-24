"""Brand profile model for nightlife businesses."""

from dataclasses import dataclass, field
from typing import List, Optional
from enum import Enum


class BusinessType(Enum):
    """Types of nightlife businesses."""
    LOUNGE = "lounge"
    BAR = "bar"
    CLUB = "club"
    RESTAURANT_NIGHTLIFE = "restaurant + nightlife"


class BrandEnergy(Enum):
    """Brand energy levels."""
    CHILL_UPSCALE = "chill & upscale"
    HIGH_ENERGY_PARTY = "high-energy party"
    SEXY_MOODY = "sexy & moody"
    CULTURAL_ARTISTIC = "cultural & artistic"


class TargetCrowd(Enum):
    """Target audience age ranges."""
    YOUNG = "21–25"
    MID = "25–30"
    MATURE = "30+"
    MIXED = "mixed"


class ContentFocus(Enum):
    """Content focus areas (max 2 allowed)."""
    EVENTS_DJS = "events & DJs"
    DRINKS_MENU = "drinks & menu"
    CROWD_ATMOSPHERE = "crowd & atmosphere"
    PROMOTIONS = "promotions"


class PostingVibe(Enum):
    """Posting style vibes."""
    CLEAN_MINIMAL = "clean & minimal"
    LOUD_HYPE = "loud & hype"
    SMOOTH_SEDUCTIVE = "smooth & seductive"


class CTAStyle(Enum):
    """Call-to-action styles."""
    RSVP = "RSVP"
    BOOK = "book"
    PULL_UP = "pull-up"
    TONIGHT = "tonight"
    SOFT_INVITE = "soft invite"


@dataclass
class BrandProfile:
    """Complete brand profile for a nightlife business."""

    business_type: BusinessType
    brand_energy: BrandEnergy
    target_crowd: TargetCrowd
    content_focus: List[ContentFocus]
    posting_vibe: PostingVibe
    cta_style: CTAStyle
    words_to_avoid: List[str] = field(default_factory=list)

    def __post_init__(self):
        """Validate brand profile."""
        if len(self.content_focus) > 2:
            raise ValueError("Content focus must have maximum 2 items")
        if len(self.content_focus) == 0:
            raise ValueError("Content focus must have at least 1 item")

    def get_tone_descriptor(self) -> str:
        """Get a description of the brand's tone based on energy."""
        tone_map = {
            BrandEnergy.HIGH_ENERGY_PARTY: "short, punchy, urgent",
            BrandEnergy.SEXY_MOODY: "minimal, confident, atmospheric",
            BrandEnergy.CHILL_UPSCALE: "refined, restrained, premium",
            BrandEnergy.CULTURAL_ARTISTIC: "expressive, stylish, culturally aware"
        }
        return tone_map.get(self.brand_energy, "confident, professional")

    def should_avoid_word(self, word: str) -> bool:
        """Check if a word should be avoided."""
        return word.lower() in [w.lower() for w in self.words_to_avoid]
