"""Base formatter for all content types."""

from abc import ABC, abstractmethod
from typing import Dict, Any
from ..models.brand_profile import BrandProfile
from ..models.event_context import EventContext


class BaseFormatter(ABC):
    """Base class for all content formatters."""

    def __init__(self, brand_profile: BrandProfile, event_context: EventContext = None):
        """Initialize formatter with brand and event context."""
        self.brand_profile = brand_profile
        self.event_context = event_context

    @abstractmethod
    def format(self, generated_content: Dict[str, Any]) -> str:
        """
        Format the generated content into the final output.

        Args:
            generated_content: Dictionary containing generated content parts

        Returns:
            Formatted string ready for posting
        """
        pass

    def _clean_output(self, text: str) -> str:
        """Remove any forbidden words and clean the text."""
        cleaned = text
        for word in self.brand_profile.words_to_avoid:
            # Case-insensitive replacement
            import re
            pattern = re.compile(re.escape(word), re.IGNORECASE)
            cleaned = pattern.sub("", cleaned)

        # Clean up extra whitespace
        cleaned = " ".join(cleaned.split())
        return cleaned.strip()

    def _validate_length(self, text: str, max_words: int, field_name: str) -> None:
        """Validate text doesn't exceed maximum word count."""
        word_count = len(text.split())
        if word_count > max_words:
            raise ValueError(
                f"{field_name} exceeds maximum {max_words} words "
                f"(got {word_count} words)"
            )
