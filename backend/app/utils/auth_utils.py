from werkzeug.security import generate_password_hash, check_password_hash
import secrets

def hash_password(password):
    """Securely hashes the password."""
    return generate_password_hash(password)

def verify_password(pwhash, password):
    """Checks if the given password matches the hash."""
    return check_password_hash(pwhash, password)

def generate_token():
    """Generates a random token for the session."""
    return secrets.token_hex(16)