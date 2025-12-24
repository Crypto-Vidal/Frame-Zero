"""Example content learning system."""

from typing import List, Dict, Optional
import re


class ExampleLearner:
    """Learns style and structure from example content."""

    def __init__(self):
        """Initialize example learner."""
        self.examples = []

    def add_example(self, content: str, content_type: str) -> None:
        """Add an example to learn from."""
        analysis = self._analyze_example(content, content_type)
        self.examples.append({
            "content": content,
            "type": content_type,
            "analysis": analysis
        })

    def _analyze_example(self, content: str, content_type: str) -> Dict:
        """Analyze an example to extract style patterns."""
        lines = content.strip().split('\n')
        sentences = re.split(r'[.!?]+', content)
        sentences = [s.strip() for s in sentences if s.strip()]

        analysis = {
            "line_count": len(lines),
            "sentence_count": len(sentences),
            "avg_sentence_length": sum(len(s.split()) for s in sentences) / len(sentences) if sentences else 0,
            "uses_emojis": bool(re.search(r'[\U0001F300-\U0001F9FF]', content)),
            "has_hashtags": '#' in content,
            "hashtag_count": len(re.findall(r'#\w+', content)),
            "exclamation_count": content.count('!'),
            "question_count": content.count('?'),
            "uses_caps": bool(re.search(r'\b[A-Z]{2,}\b', content)),
            "tone_markers": self._detect_tone_markers(content),
            "structure": self._detect_structure(lines, content_type)
        }

        return analysis

    def _detect_tone_markers(self, content: str) -> List[str]:
        """Detect tone indicators in content."""
        markers = []

        # Check for urgency
        if any(word in content.lower() for word in ['tonight', 'now', 'live', 'happening']):
            markers.append("urgent")

        # Check for exclusivity
        if any(word in content.lower() for word in ['exclusive', 'vip', 'private']):
            markers.append("exclusive")

        # Check for casual language
        if any(word in content.lower() for word in ['pull up', 'come through', 'vibe']):
            markers.append("casual")

        # Check for premium language
        if any(word in content.lower() for word in ['curated', 'premium', 'elevated', 'refined']):
            markers.append("premium")

        return markers

    def _detect_structure(self, lines: List[str], content_type: str) -> Dict:
        """Detect structural patterns in example."""
        structure = {
            "has_hook": False,
            "has_cta": False,
            "paragraph_count": 0
        }

        # Detect hook (short first line)
        if lines and len(lines[0].split()) <= 8:
            structure["has_hook"] = True

        # Detect CTA (common CTA words in last section)
        cta_words = ['rsvp', 'book', 'reserve', 'tonight', 'tap', 'link', 'dm']
        last_lines = ' '.join(lines[-3:]).lower() if len(lines) >= 3 else ''
        if any(word in last_lines for word in cta_words):
            structure["has_cta"] = True

        # Count paragraphs (empty lines)
        structure["paragraph_count"] = len([l for l in lines if l.strip() == '']) + 1

        return structure

    def get_style_guidance(self, content_type: str) -> Optional[str]:
        """Get style guidance based on learned examples."""
        relevant_examples = [e for e in self.examples if e["type"] == content_type]

        if not relevant_examples:
            return None

        # Aggregate patterns from examples
        avg_sentence_length = sum(
            e["analysis"]["avg_sentence_length"] for e in relevant_examples
        ) / len(relevant_examples)

        uses_emojis = any(e["analysis"]["uses_emojis"] for e in relevant_examples)
        avg_hashtags = sum(
            e["analysis"]["hashtag_count"] for e in relevant_examples
        ) / len(relevant_examples)

        common_tones = {}
        for example in relevant_examples:
            for tone in example["analysis"]["tone_markers"]:
                common_tones[tone] = common_tones.get(tone, 0) + 1

        dominant_tone = max(common_tones.items(), key=lambda x: x[1])[0] if common_tones else "neutral"

        guidance = f"""
LEARNED FROM EXAMPLES:
- Average sentence length: {avg_sentence_length:.1f} words
- Emoji usage: {"Yes" if uses_emojis else "No"}
- Typical hashtag count: {avg_hashtags:.0f}
- Dominant tone: {dominant_tone}
- Match the exact structure and pacing of provided examples
- Mirror the confidence level and directness observed in examples
"""
        return guidance.strip()

    def get_example_reference(self, content_type: str) -> Optional[str]:
        """Get a reference example for the content type."""
        relevant = [e for e in self.examples if e["type"] == content_type]
        if relevant:
            return relevant[0]["content"]
        return None
