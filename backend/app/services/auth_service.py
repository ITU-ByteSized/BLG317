"""
Auth service (mocked).

Provides a lightweight layer for login/signup used by the auth routes.
Replace with real storage and hashing in production.
"""
from typing import Dict


def authenticate(email: str, password: str) -> Dict:
	# Accept any credentials in dev; return a user object
	user = {
		"username": email.split("@")[0],
		"email": email,
		"avatarUrl": f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}",
	}
	token = "dev-token"
	return {"user": user, "token": token}


def register(email: str, password: str) -> Dict:
	# Mock register mirrors authenticate
	return authenticate(email, password)
