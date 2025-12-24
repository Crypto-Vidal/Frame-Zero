#!/usr/bin/env python3
"""
CLI interface for Nightlife Social Content Engine.

Usage:
    python generate_content.py --config config/brand_profile.json \
                               --content-type "Instagram Reel" \
                               --event-name "Late Night Sessions" \
                               --dj "DJ Shadow"
"""

import argparse
import sys
from datetime import datetime
from pathlib import Path

from nightlife_engine import ContentGenerator, BrandProfile
from nightlife_engine.models.content_request import ContentRequest, ContentType, MediaType
from nightlife_engine.models.event_context import EventContext
from nightlife_engine.utils.config_loader import ConfigLoader


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Generate social media content for nightlife businesses"
    )

    parser.add_argument(
        "--config",
        type=str,
        required=True,
        help="Path to brand profile JSON config file"
    )

    parser.add_argument(
        "--content-type",
        type=str,
        required=True,
        choices=[
            "Instagram Reel",
            "Instagram Post",
            "Promotion",
            "Flyer"
        ],
        help="Type of content to generate"
    )

    parser.add_argument(
        "--media-type",
        type=str,
        default="photo",
        choices=["photo", "video"],
        help="Type of media (photo or video)"
    )

    parser.add_argument(
        "--media-count",
        type=int,
        default=1,
        help="Number of media files"
    )

    # Event context arguments
    parser.add_argument(
        "--event-name",
        type=str,
        help="Name of the event"
    )

    parser.add_argument(
        "--event-date",
        type=str,
        help="Event date (YYYY-MM-DD format)"
    )

    parser.add_argument(
        "--dj",
        type=str,
        help="DJ or performer name"
    )

    parser.add_argument(
        "--notes",
        type=str,
        help="Special notes about the event"
    )

    parser.add_argument(
        "--example",
        type=str,
        help="Path to example content file to learn from"
    )

    parser.add_argument(
        "--output",
        type=str,
        help="Output file path (if not specified, prints to stdout)"
    )

    return parser.parse_args()


def main():
    """Main CLI entry point."""
    args = parse_args()

    try:
        # Load brand profile
        brand_profile = ConfigLoader.load_from_file(args.config)

        # Create event context
        event_context = None
        if any([args.event_name, args.event_date, args.dj, args.notes]):
            event_date = None
            if args.event_date:
                try:
                    event_date = datetime.strptime(args.event_date, "%Y-%m-%d")
                except ValueError:
                    print(f"Error: Invalid date format. Use YYYY-MM-DD", file=sys.stderr)
                    sys.exit(1)

            event_context = EventContext(
                event_name=args.event_name,
                date=event_date,
                dj_performer=args.dj,
                special_notes=args.notes
            )

        # Load example content if provided
        example_content = None
        if args.example:
            example_path = Path(args.example)
            if example_path.exists():
                with open(example_path, 'r') as f:
                    example_content = f.read()
            else:
                print(f"Warning: Example file not found: {args.example}", file=sys.stderr)

        # Create content request
        content_request = ContentRequest(
            media_type=MediaType(args.media_type),
            media_count=args.media_count,
            content_type=ContentType(args.content_type),
            brand_profile=brand_profile,
            event_context=event_context,
            example_content=example_content
        )

        # Generate content
        generator = ContentGenerator()
        content = generator.generate(content_request)

        # Output result
        if args.output:
            output_path = Path(args.output)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'w') as f:
                f.write(content)
            print(f"Content saved to: {args.output}")
        else:
            print("\n" + "="*50)
            print(content)
            print("="*50 + "\n")

    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
