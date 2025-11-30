import re
from typing import Tuple


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_email(email: str) -> bool:
	if not email or not isinstance(email, str):
		return False
	return bool(EMAIL_RE.match(email))


def validate_password(password: str) -> Tuple[bool, str]:
	if not password or not isinstance(password, str):
		return False, "Password must be a string"
	if len(password) < 6:
		return False, "Password must be at least 6 characters"
	return True, ""
