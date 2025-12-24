"""Instagram Post content formatter."""

from typing import Dict, Any
from .base_formatter import BaseFormatter


class InstagramPostFormatter(BaseFormatter):
    """
    Formats content for Instagram Posts.

    Output format:
    • Caption (max 2 sentences)
    • CTA line
    • Hashtags (exactly 5)
    """

    def format(self, generated_content: Dict[str, Any]) -> str:
        """Format Instagram Post content."""
        caption = generated_content.get("caption", "")
        cta = generated_content.get("cta", "")
        hashtags = generated_content.get("hashtags", [])

        # Ensure exactly 5 hashtags
        if len(hashtags) != 5:
            raise ValueError(f"Must have exactly 5 hashtags (got {len(hashtags)})")

        # Clean all parts
        caption = self._clean_output(caption)
        cta = self._clean_output(cta)
        hashtags = [self._clean_output(tag) for tag in hashtags]

        # Validate caption is max 2 sentences
        sentence_count = caption.count('.') + caption.count('!') + caption.count('?')
        if sentence_count > 2:
            raise ValueError(f"Caption must be max 2 sentences (got {sentence_count})")

        # Format output
        output_parts = [
            caption,
            "",
            cta,
            "",
            " ".join(hashtags)
        ]

        return "\n".join(output_parts)
