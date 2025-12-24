# Nightlife Social Content Engine

A structured social media content generator for nightlife businesses (lounges, bars, clubs).

Transform your media into ready-to-post Instagram content, promotions, and flyers that match your brand's unique voice and style.

## Features

- **Template-Based Generation**: Create Instagram Reels, Posts, Promotions, and Flyers
- **Brand Profile System**: Define your business type, energy, target audience, and posting style
- **Style Enforcement**: Automatic tone matching, forbidden word filtering, and format validation
- **Example Learning**: Train the system with your existing content for consistent voice
- **Clean Output**: Production-ready content with no explanations or commentary

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Crypto-Vidal/Frame-Zero.git
cd Frame-Zero

# Install dependencies (optional, no external deps required)
pip install -r requirements.txt
```

### 2. Create Your Brand Profile

Create a JSON configuration file with your brand details:

```json
{
  "business_type": "lounge",
  "brand_energy": "chill & upscale",
  "target_crowd": "25–30",
  "content_focus": ["events & DJs", "crowd & atmosphere"],
  "posting_vibe": "clean & minimal",
  "cta_style": "RSVP",
  "words_to_avoid": ["epic", "unforgettable"]
}
```

See `config/brand_profile_template.json` for a complete template.

### 3. Generate Content

```bash
python generate_content.py \
  --config config/brand_profile_template.json \
  --content-type "Instagram Reel" \
  --event-name "Late Night Sessions" \
  --dj "DJ Shadow" \
  --event-date "2025-01-15"
```

Output:
```
Late Night Sessions

DJ Shadow on the decks. Energy unmatched.

RSVP via link in bio.

#nightlife #nightout #weekend #livemusic #dj
```

## Content Types

### Instagram Reel
- Hook caption (max 8 words)
- Main caption (1-2 sentences)
- CTA line
- Exactly 5 hashtags

### Instagram Post
- Caption (max 2 sentences)
- CTA line
- Exactly 5 hashtags

### Promotion
- Headline
- Promo copy (2-3 sentences)
- CTA line

### Flyer
- Headline
- Subheadline
- Event details (structured)

## Brand Profile Options

### Business Type
- `lounge`
- `bar`
- `club`
- `restaurant + nightlife`

### Brand Energy
- `chill & upscale` - Refined, restrained, premium
- `high-energy party` - Short, punchy, urgent
- `sexy & moody` - Minimal, confident, atmospheric
- `cultural & artistic` - Expressive, stylish, culturally aware

### Target Crowd
- `21–25`
- `25–30`
- `30+`
- `mixed`

### Content Focus (max 2)
- `events & DJs`
- `drinks & menu`
- `crowd & atmosphere`
- `promotions`

### Posting Vibe
- `clean & minimal`
- `loud & hype`
- `smooth & seductive`

### CTA Style
- `RSVP` - Formal reservation tone
- `book` - Direct booking language
- `pull-up` - Casual street-smart tone
- `tonight` - Urgent immediate action
- `soft invite` - Subtle, no hard sell

## CLI Usage

```bash
python generate_content.py [OPTIONS]

Required:
  --config PATH              Path to brand profile JSON
  --content-type TYPE        Content type to generate

Optional:
  --media-type TYPE          photo or video (default: photo)
  --media-count N            Number of media files (default: 1)
  --event-name NAME          Event name
  --event-date YYYY-MM-DD    Event date
  --dj NAME                  DJ or performer name
  --notes TEXT               Special event notes
  --example PATH             Path to example content file
  --output PATH              Output file (default: stdout)
```

## Python API

```python
from nightlife_engine import ContentGenerator
from nightlife_engine.models import BrandProfile, ContentRequest, EventContext
from nightlife_engine.models.brand_profile import *
from nightlife_engine.models.content_request import ContentType, MediaType
from datetime import datetime

# Create brand profile
brand = BrandProfile(
    business_type=BusinessType.LOUNGE,
    brand_energy=BrandEnergy.CHILL_UPSCALE,
    target_crowd=TargetCrowd.MID,
    content_focus=[ContentFocus.EVENTS_DJS],
    posting_vibe=PostingVibe.CLEAN_MINIMAL,
    cta_style=CTAStyle.RSVP,
    words_to_avoid=["epic", "unforgettable"]
)

# Create event context
event = EventContext(
    event_name="Late Night Sessions",
    date=datetime(2025, 1, 15),
    dj_performer="DJ Shadow"
)

# Create content request
request = ContentRequest(
    media_type=MediaType.PHOTO,
    media_count=1,
    content_type=ContentType.INSTAGRAM_REEL,
    brand_profile=brand,
    event_context=event
)

# Generate content
generator = ContentGenerator()
content = generator.generate(request)
print(content)
```

## Example Configurations

The `config/` directory includes several example brand profiles:

- `brand_profile_template.json` - Upscale lounge (default)
- `high_energy_club.json` - High-energy party club
- `sexy_lounge.json` - Sophisticated moody lounge

## Example Content

The `examples/` directory includes reference content:

- `instagram_reel_example.txt`
- `instagram_post_example.txt`
- `promotion_example.txt`

Use these as training examples:

```bash
python generate_content.py \
  --config config/brand_profile_template.json \
  --content-type "Instagram Post" \
  --example examples/instagram_post_example.txt
```

## Core Principles

The engine follows strict rules to ensure professional output:

✅ **DO:**
- Match brand tone and energy precisely
- Follow format requirements strictly
- Use clean, concise language
- Sound like a professional nightlife promoter
- Avoid generic marketing copy

❌ **DON'T:**
- Add explanations or commentary
- Use clichés or filler phrases
- Include tips or alternatives
- Sound like generic marketing
- Exceed word/sentence limits

## Architecture

```
nightlife_engine/
├── core/
│   ├── content_generator.py    # Main generation engine
│   ├── style_engine.py          # Style/tone enforcement
│   └── example_learner.py       # Example pattern learning
├── models/
│   ├── brand_profile.py         # Brand configuration
│   ├── content_request.py       # Request model
│   └── event_context.py         # Event information
├── formatters/
│   ├── instagram_reel_formatter.py
│   ├── instagram_post_formatter.py
│   ├── promotion_formatter.py
│   └── flyer_formatter.py
└── utils/
    └── config_loader.py         # JSON config loading
```

## Development

### Running Tests

```bash
pytest tests/
```

### Code Formatting

```bash
black nightlife_engine/
flake8 nightlife_engine/
mypy nightlife_engine/
```

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please read CONTRIBUTING.md for guidelines.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built for nightlife businesses that demand quality content without the generic marketing fluff.**
