"""Configuration loader for brand profiles."""

import json
from typing import Dict, Any, Optional
from pathlib import Path
from ..models.brand_profile import (
    BrandProfile,
    BusinessType,
    BrandEnergy,
    TargetCrowd,
    ContentFocus,
    PostingVibe,
    CTAStyle
)


class ConfigLoader:
    """Load brand profiles from JSON configuration files."""

    @staticmethod
    def load_from_file(file_path: str) -> BrandProfile:
        """
        Load brand profile from JSON file.

        Args:
            file_path: Path to JSON configuration file

        Returns:
            BrandProfile instance

        Raises:
            FileNotFoundError: If config file doesn't exist
            ValueError: If config is invalid
        """
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Config file not found: {file_path}")

        with open(path, 'r') as f:
            config_data = json.load(f)

        return ConfigLoader.load_from_dict(config_data)

    @staticmethod
    def load_from_dict(config: Dict[str, Any]) -> BrandProfile:
        """
        Load brand profile from dictionary.

        Args:
            config: Dictionary with brand profile data

        Returns:
            BrandProfile instance

        Raises:
            ValueError: If config is invalid
        """
        try:
            # Parse enums
            business_type = BusinessType(config["business_type"])
            brand_energy = BrandEnergy(config["brand_energy"])
            target_crowd = TargetCrowd(config["target_crowd"])
            posting_vibe = PostingVibe(config["posting_vibe"])
            cta_style = CTAStyle(config["cta_style"])

            # Parse content focus (list of enums)
            content_focus = [
                ContentFocus(focus) for focus in config["content_focus"]
            ]

            # Get optional words to avoid
            words_to_avoid = config.get("words_to_avoid", [])

            return BrandProfile(
                business_type=business_type,
                brand_energy=brand_energy,
                target_crowd=target_crowd,
                content_focus=content_focus,
                posting_vibe=posting_vibe,
                cta_style=cta_style,
                words_to_avoid=words_to_avoid
            )

        except KeyError as e:
            raise ValueError(f"Missing required config field: {e}")
        except ValueError as e:
            raise ValueError(f"Invalid config value: {e}")

    @staticmethod
    def save_to_file(profile: BrandProfile, file_path: str) -> None:
        """
        Save brand profile to JSON file.

        Args:
            profile: BrandProfile to save
            file_path: Path to save JSON file
        """
        config = {
            "business_type": profile.business_type.value,
            "brand_energy": profile.brand_energy.value,
            "target_crowd": profile.target_crowd.value,
            "content_focus": [f.value for f in profile.content_focus],
            "posting_vibe": profile.posting_vibe.value,
            "cta_style": profile.cta_style.value,
            "words_to_avoid": profile.words_to_avoid
        }

        path = Path(file_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, 'w') as f:
            json.dump(config, f, indent=2)

    @staticmethod
    def create_template(file_path: str) -> None:
        """
        Create a template configuration file.

        Args:
            file_path: Path to create template file
        """
        template = {
            "business_type": "lounge",
            "brand_energy": "chill & upscale",
            "target_crowd": "25–30",
            "content_focus": ["events & DJs", "crowd & atmosphere"],
            "posting_vibe": "clean & minimal",
            "cta_style": "RSVP",
            "words_to_avoid": [
                "epic",
                "unforgettable",
                "exclusive opportunity"
            ]
        }

        path = Path(file_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, 'w') as f:
            json.dump(template, f, indent=2)
