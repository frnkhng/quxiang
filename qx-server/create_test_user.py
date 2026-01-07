#!/usr/bin/env python3
"""Script to create a test staff user with correct password hash"""

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Generate hash for password "password123"
password = "password123"
password_hash = pwd_context.hash(password)

print("Password hash for 'password123':")
print(password_hash)
print("\nSQL to update user:")
print(f"""
UPDATE users 
SET password_hash = '{password_hash}'
WHERE username = 'staff1';
""")

print("\nOr to create new user:")
print(f"""
INSERT INTO users (id, role, username, password_hash, store_id, created_at) 
VALUES (
  UUID(),
  'STAFF',
  'staff1',
  '{password_hash}',
  'store-001',
  NOW()
);
""")
