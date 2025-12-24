"""Content request model."""

from dataclasses import dataclass
from typing import Optional, List
from enum import Enum
from .brand_profile import BrandProfile
from .event_context import EventContext


class MediaType(Enum):
    """Type of media being uploaded."""
    PHOTO = "photo"
    VIDEO = "video"


class ContentType(Enum):
    """Type of content to generate."""
    INSTAGRAM_REEL = "Instagram Reel"
    INSTAGRAM_POST = "Instagram Post"
    PROMOTION = "Promotion"
    FLYER = "Flyer"


@dataclass
class ContentRequest:
    """A complete content generation request."""

    # Media information (required)
    media_type: MediaType
    media_count: int

    # Content type (required)
    content_type: ContentType

    # Brand and event context (required/optional)
    brand_profile: BrandProfile = None
    event_context: EventContext = None

    # Optional fields
    media_paths: Optional[List[str]] = None
    example_content: Optional[str] = None

    def __post_init__(self):
        """Validate content request."""
        if self.media_count < 1:
            raise ValueError("Media count must be at least 1")

        if self.media_paths and len(self.media_paths) != self.media_count:
            raise ValueError("Media paths count must match media_count")
