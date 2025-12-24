"""Event context model for nightlife events."""

from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class EventContext:
    """Context information for a specific event."""

    event_name: Optional[str] = None
    date: Optional[datetime] = None
    dj_performer: Optional[str] = None
    special_notes: Optional[str] = None

    def has_event_info(self) -> bool:
        """Check if any event information is provided."""
        return any([
            self.event_name,
            self.date,
            self.dj_performer,
            self.special_notes
        ])

    def format_date(self, format_str: str = "%A, %B %d") -> Optional[str]:
        """Format the event date."""
        if self.date:
            return self.date.strftime(format_str)
        return None
