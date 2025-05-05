from datetime import datetime, timezone, timedelta


def get_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)
