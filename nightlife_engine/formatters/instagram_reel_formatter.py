"""Instagram Reel content formatter."""

from typing import Dict, Any
from .base_formatter import BaseFormatter


class InstagramReelFormatter(BaseFormatter):
    """
    Formats content for Instagram Reels.

    Output format:
    • Hook caption (max 8 words)
    • Main caption (1–2 sentences max)
    • CTA line (1 short sentence)
    • Hashtags (exactly 5)
    """

    def format(self, generated_content: Dict[str, Any]) -> str:
        """Format Instagram Reel content."""
        hook = generated_content.get("hook", "")
        caption = generated_content.get("caption", "")
        cta = generated_content.get("cta", "")
        hashtags = generated_content.get("hashtags", [])

        # Validate hook length
        self._validate_length(hook, 8, "Hook caption")

        # Ensure exactly 5 hashtags
        if len(hashtags) != 5:
            raise ValueError(f"Must have exactly 5 hashtags (got {len(hashtags)})")

        # Clean all parts
        hook = self._clean_output(hook)
        caption = self._clean_output(caption)
        cta = self._clean_output(cta)
        hashtags = [self._clean_output(tag) for tag in hashtags]

        # Format output
        output_parts = [
            hook,
            "",
            caption,
            "",
            cta,
            "",
            " ".join(hashtags)
        ]

        return "\n".join(output_parts)
