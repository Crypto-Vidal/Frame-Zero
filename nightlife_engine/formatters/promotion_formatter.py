"""Promotion content formatter."""

from typing import Dict, Any
from .base_formatter import BaseFormatter


class PromotionFormatter(BaseFormatter):
    """
    Formats content for Promotions.

    Output format:
    • Headline
    • Promo copy (2–3 short sentences)
    • CTA line
    """

    def format(self, generated_content: Dict[str, Any]) -> str:
        """Format Promotion content."""
        headline = generated_content.get("headline", "")
        promo_copy = generated_content.get("promo_copy", "")
        cta = generated_content.get("cta", "")

        # Clean all parts
        headline = self._clean_output(headline)
        promo_copy = self._clean_output(promo_copy)
        cta = self._clean_output(cta)

        # Validate promo copy is 2-3 sentences
        sentence_count = promo_copy.count('.') + promo_copy.count('!') + promo_copy.count('?')
        if sentence_count < 2 or sentence_count > 3:
            raise ValueError(
                f"Promo copy must be 2-3 sentences (got {sentence_count})"
            )

        # Format output
        output_parts = [
            headline,
            "",
            promo_copy,
            "",
            cta
        ]

        return "\n".join(output_parts)
