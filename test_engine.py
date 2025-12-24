#!/usr/bin/env python3
"""
Test script to verify the Nightlife Content Engine works correctly.
"""

from datetime import datetime
from nightlife_engine import ContentGenerator
from nightlife_engine.models.brand_profile import (
    BrandProfile,
    BusinessType,
    BrandEnergy,
    TargetCrowd,
    ContentFocus,
    PostingVibe,
    CTAStyle
)
from nightlife_engine.models.content_request import ContentRequest, ContentType, MediaType
from nightlife_engine.models.event_context import EventContext


def test_instagram_reel():
    """Test Instagram Reel generation."""
    print("\n" + "="*60)
    print("TEST: Instagram Reel - High Energy Club")
    print("="*60)

    brand = BrandProfile(
        business_type=BusinessType.CLUB,
        brand_energy=BrandEnergy.HIGH_ENERGY_PARTY,
        target_crowd=TargetCrowd.YOUNG,
        content_focus=[ContentFocus.EVENTS_DJS],
        posting_vibe=PostingVibe.LOUD_HYPE,
        cta_style=CTAStyle.PULL_UP
    )

    event = EventContext(
        event_name="Friday Nights",
        date=datetime(2025, 1, 17),
        dj_performer="DJ Ace"
    )

    request = ContentRequest(
        media_type=MediaType.VIDEO,
        media_count=1,
        content_type=ContentType.INSTAGRAM_REEL,
        brand_profile=brand,
        event_context=event
    )

    generator = ContentGenerator()
    content = generator.generate(request)
    print(content)
    print()


def test_instagram_post():
    """Test Instagram Post generation."""
    print("\n" + "="*60)
    print("TEST: Instagram Post - Upscale Lounge")
    print("="*60)

    brand = BrandProfile(
        business_type=BusinessType.LOUNGE,
        brand_energy=BrandEnergy.CHILL_UPSCALE,
        target_crowd=TargetCrowd.MID,
        content_focus=[ContentFocus.DRINKS_MENU, ContentFocus.CROWD_ATMOSPHERE],
        posting_vibe=PostingVibe.CLEAN_MINIMAL,
        cta_style=CTAStyle.RSVP
    )

    request = ContentRequest(
        media_type=MediaType.PHOTO,
        media_count=3,
        content_type=ContentType.INSTAGRAM_POST,
        brand_profile=brand
    )

    generator = ContentGenerator()
    content = generator.generate(request)
    print(content)
    print()


def test_promotion():
    """Test Promotion generation."""
    print("\n" + "="*60)
    print("TEST: Promotion - Sexy Lounge")
    print("="*60)

    brand = BrandProfile(
        business_type=BusinessType.LOUNGE,
        brand_energy=BrandEnergy.SEXY_MOODY,
        target_crowd=TargetCrowd.MATURE,
        content_focus=[ContentFocus.PROMOTIONS],
        posting_vibe=PostingVibe.SMOOTH_SEDUCTIVE,
        cta_style=CTAStyle.SOFT_INVITE,
        words_to_avoid=["party", "wild"]
    )

    event = EventContext(
        event_name="Midnight Sessions",
        special_notes="Half-price premium bottles until 2am"
    )

    request = ContentRequest(
        media_type=MediaType.PHOTO,
        media_count=1,
        content_type=ContentType.PROMOTION,
        brand_profile=brand,
        event_context=event
    )

    generator = ContentGenerator()
    content = generator.generate(request)
    print(content)
    print()


def test_flyer():
    """Test Flyer generation."""
    print("\n" + "="*60)
    print("TEST: Flyer - Cultural Artistic Bar")
    print("="*60)

    brand = BrandProfile(
        business_type=BusinessType.BAR,
        brand_energy=BrandEnergy.CULTURAL_ARTISTIC,
        target_crowd=TargetCrowd.MIXED,
        content_focus=[ContentFocus.EVENTS_DJS],
        posting_vibe=PostingVibe.CLEAN_MINIMAL,
        cta_style=CTAStyle.BOOK
    )

    event = EventContext(
        event_name="Jazz & Soul Night",
        date=datetime(2025, 1, 20),
        dj_performer="The Groove Collective",
        special_notes="Live jazz fusion performance"
    )

    request = ContentRequest(
        media_type=MediaType.PHOTO,
        media_count=1,
        content_type=ContentType.FLYER,
        brand_profile=brand,
        event_context=event
    )

    generator = ContentGenerator()
    content = generator.generate(request)
    print(content)
    print()


def main():
    """Run all tests."""
    print("\n" + "#"*60)
    print("# Nightlife Content Engine - Test Suite")
    print("#"*60)

    try:
        test_instagram_reel()
        test_instagram_post()
        test_promotion()
        test_flyer()

        print("\n" + "="*60)
        print("✓ All tests completed successfully!")
        print("="*60 + "\n")

    except Exception as e:
        print(f"\n✗ Test failed: {e}\n")
        raise


if __name__ == "__main__":
    main()
