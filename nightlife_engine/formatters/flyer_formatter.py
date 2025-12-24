"""Flyer content formatter."""

from typing import Dict, Any
from .base_formatter import BaseFormatter


class FlyerFormatter(BaseFormatter):
    """
    Formats content for Flyers.

    Output format:
    • Headline
    • Subheadline
    • Event details section (clean, structured text)
    """

    def format(self, generated_content: Dict[str, Any]) -> str:
        """Format Flyer content."""
        headline = generated_content.get("headline", "")
        subheadline = generated_content.get("subheadline", "")
        event_details = generated_content.get("event_details", "")

        # Clean headline and subheadline
        headline = self._clean_output(headline)
        subheadline = self._clean_output(subheadline)

        # Clean event_details but preserve newlines
        event_details = self._clean_multiline(event_details)

        # Format output
        output_parts = [
            headline,
            subheadline,
            "",
            event_details
        ]

        return "\n".join(output_parts)

    def _clean_multiline(self, text: str) -> str:
        """Clean text while preserving newlines."""
        lines = text.split('\n')
        cleaned_lines = []
        for line in lines:
            # Clean each line individually
            cleaned = line
            for word in self.brand_profile.words_to_avoid:
                import re
                pattern = re.compile(re.escape(word), re.IGNORECASE)
                cleaned = pattern.sub("", cleaned)
            # Clean extra whitespace within the line
            cleaned = " ".join(cleaned.split())
            if cleaned:  # Only add non-empty lines
                cleaned_lines.append(cleaned.strip())
        return "\n".join(cleaned_lines)
